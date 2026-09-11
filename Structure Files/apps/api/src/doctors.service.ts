// apps/api/src/modules/doctors/doctors.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { SearchService } from '../search/search.service';
import { DoctorStatus, Prisma } from '@prisma/client';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { SearchDoctorsDto } from './dto/search-doctors.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class DoctorsService {
  private readonly logger = new Logger(DoctorsService.name);
  private readonly CACHE_TTL = 300; // 5 minutes
  private readonly DOCTOR_INCLUDE = {
    user: { select: { email: true, phone: true } },
    specialties: {
      include: { specialty: true },
      orderBy: { isPrimary: 'desc' as const },
    },
    qualifications: { orderBy: { sortOrder: 'asc' as const } },
    chambers: {
      include: {
        area: true,
        schedules: true,
      },
    },
    hospitals: {
      include: { hospital: { select: { id: true, name: true, slug: true, logo: true, type: true } } },
      where: { isActive: true },
    },
    district: { include: { division: true } },
    awards: true,
    memberships: true,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly searchService: SearchService,
  ) {}

  async create(createDoctorDto: CreateDoctorDto, userId: string) {
    const existingDoctor = await this.prisma.doctor.findUnique({ where: { userId } });
    if (existingDoctor) {
      throw new BadRequestException('Doctor profile already exists for this user');
    }

    const slug = await this.generateSlug(createDoctorDto.name);

    const doctor = await this.prisma.$transaction(async (tx) => {
      const newDoctor = await tx.doctor.create({
        data: {
          userId,
          slug,
          name: createDoctorDto.name,
          nameBn: createDoctorDto.nameBn,
          title: createDoctorDto.title,
          gender: createDoctorDto.gender,
          bmdcNumber: createDoctorDto.bmdcNumber,
          about: createDoctorDto.about,
          aboutBn: createDoctorDto.aboutBn,
          experience: createDoctorDto.experience,
          consultationFee: createDoctorDto.consultationFee,
          followUpFee: createDoctorDto.followUpFee,
          telemedicineFee: createDoctorDto.telemedicineFee,
          phone: createDoctorDto.phone,
          whatsapp: createDoctorDto.whatsapp,
          languages: createDoctorDto.languages || ['bn', 'en'],
          districtId: createDoctorDto.districtId,
          status: DoctorStatus.PENDING_APPROVAL,
          metaTitle: `${createDoctorDto.name} - Doctor Profile | Swastha BD`,
          metaDescription: `Book appointment with ${createDoctorDto.name}. ${createDoctorDto.experience} years experience.`,
        },
        include: this.DOCTOR_INCLUDE,
      });

      // Create qualifications
      if (createDoctorDto.qualifications?.length) {
        await tx.doctorQualification.createMany({
          data: createDoctorDto.qualifications.map((q, i) => ({
            doctorId: newDoctor.id,
            degree: q.degree,
            institution: q.institution,
            country: q.country || 'Bangladesh',
            year: q.year,
            sortOrder: i,
          })),
        });
      }

      // Link specialties
      if (createDoctorDto.specialtyIds?.length) {
        await tx.doctorSpecialty.createMany({
          data: createDoctorDto.specialtyIds.map((id, i) => ({
            doctorId: newDoctor.id,
            specialtyId: id,
            isPrimary: i === 0,
          })),
        });
      }

      return newDoctor;
    });

    // Index in search
    await this.searchService.indexDoctor(doctor).catch((err) =>
      this.logger.error(`Failed to index doctor ${doctor.id}:`, err),
    );

    return doctor;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 20 } = paginationDto;
    const skip = (page - 1) * limit;

    const cacheKey = `doctors:list:${page}:${limit}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const [doctors, total] = await this.prisma.$transaction([
      this.prisma.doctor.findMany({
        where: { status: DoctorStatus.ACTIVE },
        include: this.getDoctorListInclude(),
        orderBy: [{ isFeatured: 'desc' }, { rating: 'desc' }, { reviewCount: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.doctor.count({ where: { status: DoctorStatus.ACTIVE } }),
    ]);

    const result = { data: doctors, total, page, limit, totalPages: Math.ceil(total / limit) };
    await this.redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(result));
    return result;
  }

  async findOne(slug: string) {
    const cacheKey = `doctor:${slug}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      // Increment view count asynchronously
      this.incrementProfileView(JSON.parse(cached).id).catch(() => {});
      return JSON.parse(cached);
    }

    const doctor = await this.prisma.doctor.findFirst({
      where: { slug, status: DoctorStatus.ACTIVE },
      include: this.DOCTOR_INCLUDE,
    });

    if (!doctor) throw new NotFoundException(`Doctor with slug "${slug}" not found`);

    await this.redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(doctor));
    await this.incrementProfileView(doctor.id).catch(() => {});

    return doctor;
  }

  async findById(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: this.DOCTOR_INCLUDE,
    });
    if (!doctor) throw new NotFoundException(`Doctor with id "${id}" not found`);
    return doctor;
  }

  async search(searchDto: SearchDoctorsDto) {
    const {
      query,
      hospitalId,
      specialtyId,
      districtId,
      areaId,
      gender,
      minFee,
      maxFee,
      minExperience,
      maxExperience,
      language,
      isAvailableOnline,
      isFeatured,
      sortBy = 'relevance',
      page = 1,
      limit = 20,
    } = searchDto;

    // Build cache key from search params
    const cacheKey = `search:doctors:${JSON.stringify(searchDto)}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const where: Prisma.DoctorWhereInput = {
      status: DoctorStatus.ACTIVE,
      ...(gender && { gender }),
      ...(districtId && { districtId }),
      ...(isAvailableOnline !== undefined && { isAvailableOnline }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(minFee !== undefined || maxFee !== undefined
        ? { consultationFee: { gte: minFee, lte: maxFee } }
        : {}),
      ...(minExperience !== undefined || maxExperience !== undefined
        ? { experience: { gte: minExperience, lte: maxExperience } }
        : {}),
      ...(language && { languages: { has: language } }),
      ...(specialtyId && {
        specialties: { some: { specialtyId } },
      }),
      ...(areaId && {
        chambers: { some: { areaId } },
      }),
      ...(hospitalId && {
  hospitals: { some: { hospitalId, isActive: true } },
}),
      ...(query && {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { nameBn: { contains: query } },
          { about: { contains: query, mode: 'insensitive' } },
          { bmdcNumber: { contains: query, mode: 'insensitive' } },
          { specialties: { some: { specialty: { name: { contains: query, mode: 'insensitive' } } } } },
          { qualifications: { some: { degree: { contains: query, mode: 'insensitive' } } } },
          { qualifications: { some: { institution: { contains: query, mode: 'insensitive' } } } },
        ],
      }),
    };

    const orderBy = this.buildOrderBy(sortBy);

    const skip = (page - 1) * limit;
    const [doctors, total] = await this.prisma.$transaction([
      this.prisma.doctor.findMany({
        where,
        include: this.getDoctorListInclude(),
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.doctor.count({ where }),
    ]);

    // Track search analytics asynchronously
    this.trackSearch(query, searchDto, total).catch(() => {});

    const result = {
      data: doctors,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      query,
      filters: { specialtyId, districtId, gender, minFee, maxFee },
    };

    await this.redis.setex(cacheKey, 60, JSON.stringify(result)); // 1 minute cache for search
    return result;
  }

  async searchBySpecialtyAndDistrict(specialtySlug: string, districtSlug: string, paginationDto: PaginationDto) {
    const [specialty, district] = await this.prisma.$transaction([
      this.prisma.specialty.findUnique({ where: { slug: specialtySlug } }),
      this.prisma.district.findUnique({ where: { slug: districtSlug } }),
    ]);

    if (!specialty) throw new NotFoundException(`Specialty "${specialtySlug}" not found`);
    if (!district) throw new NotFoundException(`District "${districtSlug}" not found`);

    const { page = 1, limit = 20 } = paginationDto;

    const [doctors, total] = await this.prisma.$transaction([
      this.prisma.doctor.findMany({
        where: {
          status: DoctorStatus.ACTIVE,
          districtId: district.id,
          specialties: { some: { specialtyId: specialty.id } },
        },
        include: this.getDoctorListInclude(),
        orderBy: [{ sponsoredRank: 'asc' }, { isFeatured: 'desc' }, { rating: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.doctor.count({
        where: {
          status: DoctorStatus.ACTIVE,
          districtId: district.id,
          specialties: { some: { specialtyId: specialty.id } },
        },
      }),
    ]);

    return {
      data: doctors,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      specialty,
      district,
      seoTitle: `Best ${specialty.name} in ${district.name} | Swastha BD`,
      seoDescription: `Find and book the best ${specialty.name} doctors in ${district.name}. ${total} verified specialists available.`,
    };
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto, userId: string) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id } });
    if (!doctor) throw new NotFoundException('Doctor not found');
    if (doctor.userId !== userId) throw new ForbiddenException('Access denied');

    const updated = await this.prisma.doctor.update({
      where: { id },
      data: {
        ...updateDoctorDto,
        // Don't allow status changes from here
        status: undefined,
        isVerified: undefined,
        isFeatured: undefined,
        sponsoredRank: undefined,
      },
      include: this.DOCTOR_INCLUDE,
    });

    // Invalidate cache
    await this.redis.del(`doctor:${doctor.slug}`);

    // Re-index in search
    await this.searchService.indexDoctor(updated).catch((err) =>
      this.logger.error(`Failed to re-index doctor ${id}:`, err),
    );

    return updated;
  }

  async updateAvailability(doctorId: string, chamberId: string, schedules: any[]) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) throw new NotFoundException('Doctor not found');

    const chamber = await this.prisma.doctorChamber.findFirst({
      where: { id: chamberId, doctorId },
    });
    if (!chamber) throw new NotFoundException('Chamber not found');

    // Delete existing schedules and recreate
    await this.prisma.$transaction(async (tx) => {
      await tx.chamberSchedule.deleteMany({ where: { chamberId } });
      await tx.chamberSchedule.createMany({
        data: schedules.map((s) => ({ ...s, chamberId })),
      });
    });

    await this.redis.del(`doctor:${doctor.slug}`);
    return this.findById(doctorId);
  }

  async addChamber(doctorId: string, chamberData: any) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) throw new NotFoundException('Doctor not found');

    const chamber = await this.prisma.doctorChamber.create({
      data: { ...chamberData, doctorId },
      include: { area: true, schedules: true },
    });

    await this.redis.del(`doctor:${doctor.slug}`);
    return chamber;
  }

  async getAvailableSlots(doctorId: string, chamberId: string, date: string) {
    const chamber = await this.prisma.doctorChamber.findFirst({
      where: { id: chamberId, doctorId },
      include: { schedules: true },
    });

    if (!chamber) throw new NotFoundException('Chamber not found');

    const dateObj = new Date(date);
    const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const dayOfWeek = dayNames[dateObj.getDay()];

    const schedule = chamber.schedules.find((s) => s.day === dayOfWeek);
    if (!schedule || schedule.isClosed) return { available: false, slots: [] };

    // Get existing appointments for that date
    const existingAppointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        chamberId,
        appointmentDate: {
          gte: new Date(date),
          lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
        },
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
      },
      select: { slotTime: true },
    });

    const bookedSlots = new Set(existingAppointments.map((a) => a.slotTime));
    const allSlots = this.generateTimeSlots(schedule.startTime, schedule.endTime, schedule.slotDuration);

    const slots = allSlots.map((time) => ({
      time,
      available: !bookedSlots.has(time),
      isBooked: bookedSlots.has(time),
    }));

    return {
      available: true,
      date,
      chamberId,
      totalSlots: allSlots.length,
      availableSlots: slots.filter((s) => s.available).length,
      slots,
    };
  }

  async getFeaturedDoctors() {
    const cacheKey = 'doctors:featured';
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const doctors = await this.prisma.doctor.findMany({
      where: { status: DoctorStatus.ACTIVE, isFeatured: true },
      include: this.getDoctorListInclude(),
      orderBy: [{ sponsoredRank: 'asc' }, { rating: 'desc' }],
      take: 12,
    });

    await this.redis.setex(cacheKey, 600, JSON.stringify(doctors));
    return doctors;
  }

  async getTrendingDoctors() {
    const cacheKey = 'doctors:trending';
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const doctors = await this.prisma.doctor.findMany({
      where: { status: DoctorStatus.ACTIVE },
      include: this.getDoctorListInclude(),
      orderBy: { profileViews: 'desc' },
      take: 8,
    });

    await this.redis.setex(cacheKey, 300, JSON.stringify(doctors));
    return doctors;
  }

  async saveDoctor(userId: string, doctorId: string) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) throw new NotFoundException('Doctor not found');

    await this.prisma.savedDoctor.upsert({
      where: { userId_doctorId: { userId, doctorId } },
      create: { userId, doctorId },
      update: {},
    });

    return { saved: true, doctorId };
  }

  async unsaveDoctor(userId: string, doctorId: string) {
    await this.prisma.savedDoctor.deleteMany({ where: { userId, doctorId } });
    return { saved: false, doctorId };
  }

  async getSavedDoctors(userId: string) {
    const saved = await this.prisma.savedDoctor.findMany({
      where: { userId },
      include: { doctor: { include: this.getDoctorListInclude() } },
      orderBy: { createdAt: 'desc' },
    });
    return saved.map((s) => s.doctor);
  }

  async getStatsByDoctor(doctorId: string, userId: string) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) throw new NotFoundException('Doctor not found');
    if (doctor.userId !== userId) throw new ForbiddenException('Access denied');

    const [totalAppointments, completedAppointments, cancelledAppointments, analytics, revenue] = await this.prisma.$transaction([
      this.prisma.appointment.count({ where: { doctorId } }),
      this.prisma.appointment.count({ where: { doctorId, status: 'COMPLETED' } }),
      this.prisma.appointment.count({ where: { doctorId, status: 'CANCELLED' } }),
      this.prisma.doctorAnalytic.findMany({
        where: { doctorId, date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
        orderBy: { date: 'asc' },
      }),
      this.prisma.appointment.aggregate({
        where: { doctorId, status: 'COMPLETED', paymentStatus: 'COMPLETED' },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      completionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0,
      profileViews: doctor.profileViews,
      searchAppearances: doctor.searchAppearances,
      rating: doctor.rating,
      reviewCount: doctor.reviewCount,
      totalRevenue: revenue._sum.totalAmount || 0,
      last30DaysAnalytics: analytics,
    };
  }

  // ============================================================
  // ADMIN METHODS
  // ============================================================

  async adminFindAll(filters: any, paginationDto: PaginationDto) {
    const { page = 1, limit = 20 } = paginationDto;
    const where: Prisma.DoctorWhereInput = {
      ...(filters.status && { status: filters.status }),
      ...(filters.districtId && { districtId: filters.districtId }),
      ...(filters.specialtyId && { specialties: { some: { specialtyId: filters.specialtyId } } }),
      ...(filters.isVerified !== undefined && { isVerified: filters.isVerified }),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { bmdcNumber: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [doctors, total] = await this.prisma.$transaction([
      this.prisma.doctor.findMany({
        where,
        include: {
          user: { select: { email: true, phone: true } },
          specialties: { include: { specialty: true } },
          district: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.doctor.count({ where }),
    ]);

    return { data: doctors, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async adminApproveDoctor(id: string, adminId: string) {
    const doctor = await this.prisma.doctor.update({
      where: { id },
      data: {
        status: DoctorStatus.ACTIVE,
        approvedAt: new Date(),
        approvedBy: adminId,
      },
    });

    // Index in search after approval
    await this.searchService.indexDoctor(doctor).catch((err) =>
      this.logger.error(`Failed to index doctor ${id}:`, err),
    );

    return doctor;
  }

  async adminVerifyBmdc(id: string, verified: boolean) {
    return this.prisma.doctor.update({
      where: { id },
      data: {
        bmdcVerified: verified,
        isVerified: verified,
        verificationStatus: verified ? 'VERIFIED' : 'REJECTED',
      },
    });
  }

  async adminUpdateFeatured(id: string, isFeatured: boolean, sponsoredRank?: number) {
    const updated = await this.prisma.doctor.update({
      where: { id },
      data: { isFeatured, ...(sponsoredRank !== undefined && { sponsoredRank }) },
    });
    await this.redis.del(`doctor:${updated.slug}`);
    await this.redis.del('doctors:featured');
    return updated;
  }

  async bulkImport(doctors: any[], adminId: string) {
    const results = { success: 0, failed: 0, errors: [] as any[] };

    for (const doctorData of doctors) {
      try {
        // Find or create user
        let user = await this.prisma.user.findUnique({ where: { email: doctorData.email } });
        if (!user) {
          user = await this.prisma.user.create({
            data: {
              email: doctorData.email,
              name: doctorData.name,
              phone: doctorData.phone,
              role: 'DOCTOR',
              status: 'ACTIVE',
            },
          });
        }

        const slug = await this.generateSlug(doctorData.name);
        await this.prisma.doctor.create({
          data: {
            userId: user.id,
            slug,
            name: doctorData.name,
            gender: doctorData.gender,
            bmdcNumber: doctorData.bmdcNumber,
            experience: doctorData.experience || 0,
            consultationFee: doctorData.consultationFee || 500,
            status: DoctorStatus.ACTIVE,
            approvedAt: new Date(),
            approvedBy: adminId,
          },
        });
        results.success++;
      } catch (error: any) {
        results.failed++;
        results.errors.push({ doctor: doctorData.name, error: error.message });
      }
    }

    return results;
  }

  // ============================================================
  // PRIVATE HELPERS
  // ============================================================

  private getDoctorListInclude() {
    return {
      specialties: {
        include: { specialty: { select: { id: true, name: true, nameBn: true, slug: true } } },
        where: { isPrimary: true },
      },
      qualifications: {
        orderBy: { sortOrder: 'asc' as const },
        take: 3,
      },
      district: { select: { id: true, name: true, nameBn: true, slug: true } },
      chambers: {
        take: 1,
        where: { isMain: true },
        include: { area: { select: { id: true, name: true, nameBn: true } } },
      },
    };
  }

  private buildOrderBy(sortBy: string): Prisma.DoctorOrderByWithRelationInput[] {
    const orderMap: Record<string, Prisma.DoctorOrderByWithRelationInput[]> = {
      relevance: [{ sponsoredRank: 'asc' }, { isFeatured: 'desc' }, { rating: 'desc' }],
      rating: [{ rating: 'desc' }, { reviewCount: 'desc' }],
      experience: [{ experience: 'desc' }],
      fee_low: [{ consultationFee: 'asc' }],
      fee_high: [{ consultationFee: 'desc' }],
      popular: [{ totalAppointments: 'desc' }],
      newest: [{ createdAt: 'desc' }],
    };
    return orderMap[sortBy] || orderMap.relevance;
  }

  private async generateSlug(name: string): Promise<string> {
    const base = name
      .toLowerCase()
      .replace(/dr\.|prof\.|assoc\.\s+prof\./gi, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    let slug = `dr-${base}`;
    let counter = 0;

    while (true) {
      const existing = await this.prisma.doctor.findUnique({
        where: { slug: counter === 0 ? slug : `${slug}-${counter}` },
      });
      if (!existing) break;
      counter++;
    }

    return counter === 0 ? slug : `${slug}-${counter}`;
  }

  private generateTimeSlots(startTime: string, endTime: string, duration: number): string[] {
    const slots: string[] = [];
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    let currentMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    while (currentMinutes < endMinutes) {
      const hours = Math.floor(currentMinutes / 60);
      const mins = currentMinutes % 60;
      slots.push(`${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`);
      currentMinutes += duration;
    }

    return slots;
  }

  private async incrementProfileView(doctorId: string) {
    await this.prisma.$transaction([
      this.prisma.doctor.update({
        where: { id: doctorId },
        data: { profileViews: { increment: 1 } },
      }),
      this.prisma.doctorAnalytic.upsert({
        where: { doctorId_date: { doctorId, date: new Date(new Date().toDateString()) } },
        create: { doctorId, date: new Date(new Date().toDateString()), profileViews: 1 },
        update: { profileViews: { increment: 1 } },
      }),
    ]);
  }

  private async trackSearch(query: string | undefined, filters: any, resultsCount: number) {
    if (!query) return;
    await this.prisma.searchHistory.create({
      data: {
        query,
        filters,
        resultsCount,
      },
    });
  }
}
