import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { SearchHospitalsDto } from './dto/search-hospitals.dto';

@Injectable()
export class HospitalsService {
  // Compact include — used for list/search/featured views
  private readonly LIST_INCLUDE = {
    area: { select: { id: true, name: true, nameBn: true } },
    district: { select: { id: true, name: true, nameBn: true, slug: true } },
    departments: { select: { id: true }, where: { isActive: true } },
  };

  // Full include — used for single-hospital detail view
  private readonly DETAIL_INCLUDE = {
    area: true,
    district: { include: { division: true } },
    departments: { where: { isActive: true } },
    openingHours: true,
    doctors: {
      where: { isActive: true },
      include: {
        doctor: {
          select: {
            id: true,
            slug: true,
            name: true,
            title: true,
            photo: true,
            rating: true,
            reviewCount: true,
            consultationFee: true,
            isVerified: true,
            specialties: {
              where: { isPrimary: true },
              include: { specialty: { select: { name: true, nameBn: true } } },
            },
          },
        },
      },
    },
  };

  constructor(private readonly prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const [hospitals, total] = await this.prisma.$transaction([
      this.prisma.hospital.findMany({
        where: { isActive: true },
        include: this.LIST_INCLUDE,
        orderBy: [{ isFeatured: 'desc' }, { rating: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.hospital.count({ where: { isActive: true } }),
    ]);

    return { data: hospitals, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getFeaturedHospitals() {
    return this.prisma.hospital.findMany({
      where: { isActive: true, isFeatured: true },
      include: this.LIST_INCLUDE,
      orderBy: { rating: 'desc' },
      take: 12,
    });
  }

  async findOne(slug: string) {
    const hospital = await this.prisma.hospital.findFirst({
      where: { slug, isActive: true },
      include: this.DETAIL_INCLUDE,
    });

    if (!hospital) throw new NotFoundException(`Hospital with slug "${slug}" not found`);
    return hospital;
  }

  async search(searchDto: SearchHospitalsDto) {
    const {
      query,
      type,
      districtSlug,
      isEmergency,
      isVerified,
      sortBy = 'featured',
      page = 1,
      limit = 20,
    } = searchDto;

    const where: Prisma.HospitalWhereInput = {
      isActive: true,
      ...(type && { type }),
      ...(isEmergency !== undefined && { isEmergency }),
      ...(isVerified !== undefined && { isVerified }),
      ...(districtSlug && { district: { slug: districtSlug } }),
      ...(query && {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { nameBn: { contains: query } },
          { address: { contains: query, mode: 'insensitive' } },
        ],
      }),
    };

    const orderBy = this.buildOrderBy(sortBy);
    const skip = (page - 1) * limit;

    const [hospitals, total] = await this.prisma.$transaction([
      this.prisma.hospital.findMany({ where, include: this.LIST_INCLUDE, orderBy, skip, take: limit }),
      this.prisma.hospital.count({ where }),
    ]);

    return { data: hospitals, total, page, limit, totalPages: Math.ceil(total / limit), query };
  }

  private buildOrderBy(sortBy: string): Prisma.HospitalOrderByWithRelationInput[] {
    const map: Record<string, Prisma.HospitalOrderByWithRelationInput[]> = {
      featured: [{ isFeatured: 'desc' }, { isEmergency: 'desc' }, { rating: 'desc' }],
      rating: [{ rating: 'desc' }, { reviewCount: 'desc' }],
      beds: [{ bedCount: 'desc' }],
      newest: [{ establishedYear: 'desc' }],
    };
    return map[sortBy] ?? map.featured;
  }
}