import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import {
  Prisma,
  DoctorStatus,
  VerificationStatus,
  AppointmentStatus,
  UserRole,
  UserStatus,
  ReviewStatus,
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AdminDoctorQueryDto,
  UpdateDoctorVerificationDto,
  AdminAppointmentQueryDto,
  AdminUserQueryDto,
} from './dto/admin-query.dto';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getOverviewStats() {
    const [
      totalDoctors,
      activeDoctors,
      pendingDoctors,
      suspendedDoctors,
      totalHospitals,
      totalAppointments,
      pendingAppointments,
      completedAppointments,
      totalPatients,
      totalUsers,
      revenueResult,
      recentAppointments,
      pendingDoctorQueue,
    ] = await this.prisma.$transaction([
      this.prisma.doctor.count(),
      this.prisma.doctor.count({ where: { status: DoctorStatus.ACTIVE } }),
      this.prisma.doctor.count({ where: { status: DoctorStatus.PENDING_APPROVAL } }),
      this.prisma.doctor.count({ where: { status: DoctorStatus.SUSPENDED } }),
      this.prisma.hospital.count(),
      this.prisma.appointment.count(),
      this.prisma.appointment.count({ where: { status: AppointmentStatus.PENDING } }),
      this.prisma.appointment.count({ where: { status: AppointmentStatus.COMPLETED } }),
      this.prisma.user.count({ where: { role: UserRole.PATIENT } }),
      this.prisma.user.count(),
      this.prisma.appointment.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: [AppointmentStatus.CONFIRMED, AppointmentStatus.COMPLETED] } },
      }),
      this.prisma.appointment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          doctor: { select: { id: true, name: true, slug: true, title: true, photo: true } },
          patient: { select: { id: true, name: true, email: true, phone: true } },
        },
      }),
      this.prisma.doctor.findMany({
        where: { status: DoctorStatus.PENDING_APPROVAL },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          specialties: {
            include: { specialty: { select: { name: true } } },
            where: { isPrimary: true },
          },
          district: { select: { name: true } },
        },
      }),
    ]);

    return {
      doctors: {
        total: totalDoctors,
        active: activeDoctors,
        pending: pendingDoctors,
        suspended: suspendedDoctors,
      },
      hospitals: {
        total: totalHospitals,
      },
      appointments: {
        total: totalAppointments,
        pending: pendingAppointments,
        completed: completedAppointments,
      },
      users: {
        total: totalUsers,
        patients: totalPatients,
      },
      revenue: {
        grossAmount: revenueResult._sum.totalAmount || 0,
      },
      recentAppointments,
      pendingDoctorQueue,
    };
  }

  async getDoctors(query: AdminDoctorQueryDto) {
    const { page = 1, limit = 20, search, status, verificationStatus, isFeatured } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.DoctorWhereInput = {
      ...(status && { status }),
      ...(verificationStatus && { verificationStatus }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { bmdcNumber: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
        ],
      }),
    };

    const [doctors, total] = await this.prisma.$transaction([
      this.prisma.doctor.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        include: {
          specialties: {
            include: { specialty: { select: { id: true, name: true, slug: true } } },
            where: { isPrimary: true },
          },
          district: { select: { id: true, name: true } },
          user: { select: { id: true, email: true, phone: true } },
        },
      }),
      this.prisma.doctor.count({ where }),
    ]);

    return {
      data: doctors,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateDoctorStatus(doctorId: string, status: DoctorStatus) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) throw new NotFoundException('Doctor not found');

    const updated = await this.prisma.doctor.update({
      where: { id: doctorId },
      data: {
        status,
        ...(status === DoctorStatus.ACTIVE && !doctor.approvedAt && {
          approvedAt: new Date(),
        }),
      },
    });

    return updated;
  }

  async updateDoctorVerification(doctorId: string, dto: UpdateDoctorVerificationDto) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) throw new NotFoundException('Doctor not found');

    const updated = await this.prisma.doctor.update({
      where: { id: doctorId },
      data: {
        verificationStatus: dto.verificationStatus,
        ...(dto.bmdcVerified !== undefined && { bmdcVerified: dto.bmdcVerified }),
        isVerified: dto.verificationStatus === VerificationStatus.VERIFIED,
      },
    });

    return updated;
  }

  async toggleDoctorFeatured(doctorId: string) {
    const doctor = await this.prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) throw new NotFoundException('Doctor not found');

    const updated = await this.prisma.doctor.update({
      where: { id: doctorId },
      data: { isFeatured: !doctor.isFeatured },
    });

    return { id: doctor.id, isFeatured: updated.isFeatured };
  }

  async getHospitals(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: Prisma.HospitalWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { address: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [hospitals, total] = await this.prisma.$transaction([
      this.prisma.hospital.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        include: {
          district: { select: { id: true, name: true } },
          _count: { select: { departments: true, chambers: true } },
        },
      }),
      this.prisma.hospital.count({ where }),
    ]);

    return {
      data: hospitals,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async toggleHospitalFeatured(hospitalId: string) {
    const hospital = await this.prisma.hospital.findUnique({ where: { id: hospitalId } });
    if (!hospital) throw new NotFoundException('Hospital not found');

    const updated = await this.prisma.hospital.update({
      where: { id: hospitalId },
      data: { isFeatured: !hospital.isFeatured },
    });

    return { id: hospital.id, isFeatured: updated.isFeatured };
  }

  async toggleHospitalVerified(hospitalId: string) {
    const hospital = await this.prisma.hospital.findUnique({ where: { id: hospitalId } });
    if (!hospital) throw new NotFoundException('Hospital not found');

    const updated = await this.prisma.hospital.update({
      where: { id: hospitalId },
      data: { isVerified: !hospital.isVerified },
    });

    return { id: hospital.id, isVerified: updated.isVerified };
  }

  async getAppointments(query: AdminAppointmentQueryDto) {
    const { page = 1, limit = 20, search, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.AppointmentWhereInput = {
      ...(status && { status }),
      ...(search && {
        OR: [
          { appointmentNumber: { contains: search, mode: 'insensitive' } },
          { patientName: { contains: search, mode: 'insensitive' } },
          { patientPhone: { contains: search } },
        ],
      }),
    };

    const [appointments, total] = await this.prisma.$transaction([
      this.prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { appointmentDate: 'desc' },
        include: {
          doctor: { select: { id: true, name: true, slug: true, title: true, photo: true } },
          patient: { select: { id: true, name: true, email: true, phone: true } },
          chamber: { select: { id: true, name: true, address: true } },
          hospital: { select: { id: true, name: true } },
        },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return {
      data: appointments,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUsers(query: AdminUserQueryDto) {
    const { page = 1, limit = 20, search, role, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      ...(role && { role }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
        ],
      }),
    };

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          nameBn: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          emailVerified: true,
          phoneVerified: true,
          createdAt: true,
          lastLoginAt: true,
          _count: { select: { appointments: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateUserStatus(userId: string, status: UserStatus) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { status },
      select: { id: true, name: true, email: true, status: true },
    });

    return updated;
  }

  async getReviews(page = 1, limit = 20, status?: ReviewStatus) {
    const skip = (page - 1) * limit;
    const where: Prisma.ReviewWhereInput = status ? { status } : {};

    const [reviews, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true, email: true } },
          doctor: { select: { id: true, name: true, slug: true } },
          hospital: { select: { id: true, name: true } },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      data: reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateReviewStatus(reviewId: string, status: ReviewStatus) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: { status },
    });

    return updated;
  }
}
