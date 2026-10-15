import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';

@Injectable()
export class PatientsService {
  private readonly logger = new Logger(PatientsService.name);

  private readonly DOCTOR_CARD_INCLUDE = {
    specialties: {
      include: { specialty: { select: { id: true, name: true, nameBn: true, slug: true } } },
      where: { isPrimary: true },
    },
    qualifications: { orderBy: { sortOrder: 'asc' as const }, take: 3 },
    district: { select: { id: true, name: true, nameBn: true, slug: true } },
    chambers: {
      include: {
        area: { select: { id: true, name: true, nameBn: true } },
        hospital: { select: { id: true, name: true, nameBn: true, slug: true } },
      },
      take: 2,
    },
  };

  constructor(private readonly prisma: PrismaService) {}

  async getStats(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalAppointments,
      upcomingAppointments,
      completedAppointments,
      cancelledAppointments,
      savedDoctorsCount,
      nextAppointment,
    ] = await this.prisma.$transaction([
      this.prisma.appointment.count({ where: { patientId: userId } }),
      this.prisma.appointment.count({
        where: {
          patientId: userId,
          status: { in: ['PENDING', 'CONFIRMED'] },
          appointmentDate: { gte: today },
        },
      }),
      this.prisma.appointment.count({
        where: { patientId: userId, status: 'COMPLETED' },
      }),
      this.prisma.appointment.count({
        where: { patientId: userId, status: 'CANCELLED' },
      }),
      this.prisma.savedDoctor.count({ where: { userId } }),
      this.prisma.appointment.findFirst({
        where: {
          patientId: userId,
          status: { in: ['PENDING', 'CONFIRMED'] },
          appointmentDate: { gte: today },
        },
        orderBy: [{ appointmentDate: 'asc' }, { slotTime: 'asc' }],
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
              nameBn: true,
              slug: true,
              title: true,
              photo: true,
              consultationFee: true,
              specialties: {
                include: { specialty: { select: { id: true, name: true, nameBn: true } } },
                where: { isPrimary: true },
              },
            },
          },
          chamber: {
            select: {
              id: true,
              name: true,
              address: true,
              hospital: { select: { id: true, name: true, slug: true } },
            },
          },
          hospital: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      }),
    ]);

    return {
      totalAppointments,
      upcomingAppointments,
      completedAppointments,
      cancelledAppointments,
      savedDoctorsCount,
      nextAppointment,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        nameBn: true,
        email: true,
        phone: true,
        gender: true,
        dateOfBirth: true,
        preferredLanguage: true,
        avatar: true,
        role: true,
        status: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    return user;
  }

  async updateProfile(userId: string, dto: UpdatePatientProfileDto) {
    // If phone is being updated, verify it is not already taken by another user
    if (dto.phone) {
      const existingWithPhone = await this.prisma.user.findFirst({
        where: {
          phone: dto.phone,
          NOT: { id: userId },
        },
      });

      if (existingWithPhone) {
        throw new ConflictException('This phone number is already registered to another account');
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.nameBn !== undefined && { nameBn: dto.nameBn }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.gender !== undefined && { gender: dto.gender }),
        ...(dto.dateOfBirth !== undefined && {
          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        }),
        ...(dto.preferredLanguage !== undefined && { preferredLanguage: dto.preferredLanguage }),
        ...(dto.avatar !== undefined && { avatar: dto.avatar }),
      },
      select: {
        id: true,
        name: true,
        nameBn: true,
        email: true,
        phone: true,
        gender: true,
        dateOfBirth: true,
        preferredLanguage: true,
        avatar: true,
        role: true,
        status: true,
        emailVerified: true,
        phoneVerified: true,
        updatedAt: true,
      },
    });

    return updated;
  }

  async getSavedDoctors(userId: string) {
    const records = await this.prisma.savedDoctor.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        doctor: {
          include: this.DOCTOR_CARD_INCLUDE,
        },
      },
    });

    return records.map((r) => ({
      ...r.doctor,
      savedAt: r.createdAt,
    }));
  }

  async saveDoctor(userId: string, doctorId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
      select: { id: true, name: true },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    await this.prisma.savedDoctor.upsert({
      where: {
        userId_doctorId: {
          userId,
          doctorId,
        },
      },
      create: {
        userId,
        doctorId,
      },
      update: {},
    });

    return { saved: true, doctorId };
  }

  async unsaveDoctor(userId: string, doctorId: string) {
    await this.prisma.savedDoctor.deleteMany({
      where: {
        userId,
        doctorId,
      },
    });

    return { saved: false, doctorId };
  }

  async checkSavedDoctor(userId: string, doctorId: string) {
    const record = await this.prisma.savedDoctor.findUnique({
      where: {
        userId_doctorId: {
          userId,
          doctorId,
        },
      },
    });

    return { isSaved: !!record };
  }
}
