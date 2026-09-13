import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Prisma, DoctorStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { SearchDoctorsDto } from './dto/search-doctors.dto';

@Injectable()
export class DoctorsService {
  private readonly logger = new Logger(DoctorsService.name);

  // Compact include — used for list/search/featured views
  private readonly LIST_INCLUDE = {
    specialties: {
      include: { specialty: { select: { id: true, name: true, nameBn: true, slug: true } } },
      where: { isPrimary: true },
    },
    qualifications: { orderBy: { sortOrder: 'asc' as const }, take: 3 },
    district: { select: { id: true, name: true, nameBn: true, slug: true } },
    chambers: {
      take: 1,
      where: { isMain: true },
      include: { area: { select: { id: true, name: true, nameBn: true } } },
    },
  };

  // Full include — used for single-doctor profile view
  private readonly DETAIL_INCLUDE = {
    specialties: { include: { specialty: true }, orderBy: { isPrimary: 'desc' as const } },
    qualifications: { orderBy: { sortOrder: 'asc' as const } },
    chambers: { include: { area: true, schedules: true } },
    hospitals: {
      where: { isActive: true },
      include: { hospital: { select: { id: true, name: true, slug: true, logo: true, type: true } } },
    },
    district: { include: { division: true } },
    awards: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const [doctors, total] = await this.prisma.$transaction([
      this.prisma.doctor.findMany({
        where: { status: DoctorStatus.ACTIVE },
        include: this.LIST_INCLUDE,
        orderBy: [{ isFeatured: 'desc' }, { rating: 'desc' }, { reviewCount: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.doctor.count({ where: { status: DoctorStatus.ACTIVE } }),
    ]);

    return { data: doctors, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getFeaturedDoctors() {
    return this.prisma.doctor.findMany({
      where: { status: DoctorStatus.ACTIVE, isFeatured: true },
      include: this.LIST_INCLUDE,
      orderBy: [{ sponsoredRank: 'asc' }, { rating: 'desc' }],
      take: 12,
    });
  }

  async findOne(slug: string) {
    let doctor = await this.prisma.doctor.findFirst({
      where: { slug, status: DoctorStatus.ACTIVE },
      include: this.DETAIL_INCLUDE,
    });

    if (!doctor) {
      doctor = await this.prisma.doctor.findFirst({
        where: {
          OR: [
            { slug: { startsWith: slug } },
            { id: slug },
          ],
          status: DoctorStatus.ACTIVE,
        },
        include: this.DETAIL_INCLUDE,
      });
    }

    if (!doctor) throw new NotFoundException(`Doctor with slug "${slug}" not found`);

    // Fire-and-forget view counter — doesn't block the response
    this.prisma.doctor
      .update({ where: { id: doctor.id }, data: { profileViews: { increment: 1 } } })
      .catch((err) => this.logger.warn(`Failed to increment profileViews for ${doctor.id}: ${err.message}`));

    return doctor;
  }

  async search(searchDto: SearchDoctorsDto) {
    const {
      query,
      specialtySlug,
      districtSlug,
      areaId,
      minFee,
      maxFee,
      minExperience,
      isAvailableOnline,
      sortBy = 'relevance',
      page = 1,
      limit = 20,
    } = searchDto;

    const where: Prisma.DoctorWhereInput = {
      status: DoctorStatus.ACTIVE,
      ...(isAvailableOnline !== undefined && { isAvailableOnline }),
      ...(minFee !== undefined || maxFee !== undefined
        ? { consultationFee: { gte: minFee, lte: maxFee } }
        : {}),
      ...(minExperience !== undefined && { experience: { gte: minExperience } }),
      ...(specialtySlug && {
        specialties: { some: { specialty: { slug: specialtySlug } } },
      }),
      ...(districtSlug && { district: { slug: districtSlug } }),
      ...(areaId && { chambers: { some: { areaId } } }),
      ...(query && {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { nameBn: { contains: query } },
          { specialties: { some: { specialty: { name: { contains: query, mode: 'insensitive' } } } } },
        ],
      }),
    };

    const orderBy = this.buildOrderBy(sortBy);
    const skip = (page - 1) * limit;

    const [doctors, total] = await this.prisma.$transaction([
      this.prisma.doctor.findMany({ where, include: this.LIST_INCLUDE, orderBy, skip, take: limit }),
      this.prisma.doctor.count({ where }),
    ]);

    return { data: doctors, total, page, limit, totalPages: Math.ceil(total / limit), query };
  }

  private buildOrderBy(sortBy: string): Prisma.DoctorOrderByWithRelationInput[] {
    const map: Record<string, Prisma.DoctorOrderByWithRelationInput[]> = {
      relevance: [{ sponsoredRank: 'asc' }, { isFeatured: 'desc' }, { rating: 'desc' }],
      rating: [{ rating: 'desc' }, { reviewCount: 'desc' }],
      experience: [{ experience: 'desc' }],
      fee_low: [{ consultationFee: 'asc' }],
      fee_high: [{ consultationFee: 'desc' }],
      popular: [{ totalAppointments: 'desc' }],
      newest: [{ createdAt: 'desc' }],
    };
    return map[sortBy] ?? map.relevance;
  }
}