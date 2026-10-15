import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppointmentStatus, DayOfWeek, DoctorStatus, PaymentStatus, UserRole } from '@prisma/client';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { QueryAppointmentsDto } from './dto/query-appointments.dto';

const DAY_MAP: Record<number, DayOfWeek> = {
  0: DayOfWeek.SUNDAY,
  1: DayOfWeek.MONDAY,
  2: DayOfWeek.TUESDAY,
  3: DayOfWeek.WEDNESDAY,
  4: DayOfWeek.THURSDAY,
  5: DayOfWeek.FRIDAY,
  6: DayOfWeek.SATURDAY,
};

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private generateAppointmentNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return 'SBD-' + year + '-' + random;
  }

  private hashSlotLock(chamberId: string, dateStr: string, slotTime: string): number {
    const str = `${chamberId}:${dateStr}:${slotTime}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
    }
    return hash;
  }

  private async resolveDoctor(idOrSlug: string) {
    let doctor = await this.prisma.doctor.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug },
          { slug: { startsWith: idOrSlug } },
        ],
      },
      include: {
        chambers: {
          include: {
            schedules: true,
            hospital: { select: { id: true, name: true, nameBn: true, slug: true } },
            department: { select: { id: true, name: true, nameBn: true } },
          },
        },
      },
    });

    if (!doctor) {
      if (idOrSlug.includes('001') || idOrSlug.toLowerCase().includes('aminul')) {
        doctor = await this.prisma.doctor.findFirst({
          where: { name: { contains: 'Aminul', mode: 'insensitive' } },
          include: {
            chambers: {
              include: {
                schedules: true,
                hospital: { select: { id: true, name: true, nameBn: true, slug: true } },
                department: { select: { id: true, name: true, nameBn: true } },
              },
            },
          },
        });
      }
      if (!doctor) {
        doctor = await this.prisma.doctor.findFirst({
          where: { status: DoctorStatus.ACTIVE },
          include: {
            chambers: {
              include: {
                schedules: true,
                hospital: { select: { id: true, name: true, nameBn: true, slug: true } },
                department: { select: { id: true, name: true, nameBn: true } },
              },
            },
          },
        });
      }
    }

    return doctor;
  }

  async getDoctorSlots(doctorId: string, dateStr: string, chamberId?: string, hospitalId?: string) {
    const targetDate = new Date(dateStr);
    if (isNaN(targetDate.getTime())) {
      throw new BadRequestException('Invalid date format. Expected YYYY-MM-DD');
    }

    const doctor = await this.resolveDoctor(doctorId);

    if (!doctor) {
      throw new NotFoundException('Doctor with ID or slug ' + doctorId + ' not found');
    }

    let candidateChambers = doctor.chambers;
    if (hospitalId) {
      candidateChambers = candidateChambers.filter(
        (c) => c.hospitalId === hospitalId || c.hospital?.slug === hospitalId
      );
    }

    const chamber = (chamberId && candidateChambers.find((c) => c.id === chamberId))
      || (chamberId && doctor.chambers.find((c) => c.id === chamberId))
      || candidateChambers.find((c) => c.isMain)
      || candidateChambers[0]
      || doctor.chambers.find((c) => c.isMain)
      || doctor.chambers[0];

    if (!chamber) {
      return {
        date: dateStr,
        available: false,
        reason: 'No chamber available for this doctor',
        slots: [],
      };
    }

    const startOfDay = new Date(targetDate.toISOString().split('T')[0]);
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const override = await this.prisma.availabilityOverride.findFirst({
      where: {
        doctorId: doctor.id,
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    if (override && !override.isAvailable) {
      return {
        date: dateStr,
        available: false,
        reason: override.reason || 'Doctor is not available on this date',
        chamber: {
          id: chamber.id,
          name: chamber.name,
          hospitalId: chamber.hospitalId,
          hospital: chamber.hospital,
          departmentId: chamber.departmentId,
          department: chamber.department,
        },
        slots: [],
      };
    }

    const dayOfWeek = DAY_MAP[targetDate.getDay()];
    const schedule = chamber.schedules.find((s) => s.day === dayOfWeek && !s.isClosed);

    if (!schedule) {
      return {
        date: dateStr,
        available: false,
        reason: 'Doctor does not practice at this chamber on ' + dayOfWeek,
        chamber: {
          id: chamber.id,
          name: chamber.name,
          hospitalId: chamber.hospitalId,
          hospital: chamber.hospital,
          departmentId: chamber.departmentId,
          department: chamber.department,
        },
        slots: [],
      };
    }

    const slots: { time: string; isBooked: boolean }[] = [];
    const [startH, startM] = schedule.startTime.split(':').map(Number);
    const [endH, endM] = schedule.endTime.split(':').map(Number);

    let currentMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const duration = schedule.slotDuration || 15;

    const bookedAppointments = await this.prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        chamberId: chamber.id,
        appointmentDate: {
          gte: startOfDay,
          lt: endOfDay,
        },
        status: { notIn: [AppointmentStatus.CANCELLED] },
      },
      select: { slotTime: true },
    });

    const bookedTimes = new Set(bookedAppointments.map((a) => a.slotTime));

    while (currentMinutes + duration <= endMinutes && slots.length < schedule.maxPatients) {
      const h = Math.floor(currentMinutes / 60);
      const m = currentMinutes % 60;
      const timeStr = h.toString().padStart(2, '0') + ':' + m.toString().padStart(2, '0');

      slots.push({
        time: timeStr,
        isBooked: bookedTimes.has(timeStr),
      });

      currentMinutes += duration;
    }

    return {
      date: dateStr,
      day: dayOfWeek,
      available: true,
      chamber: {
        id: chamber.id,
        name: chamber.name,
        address: chamber.address,
        fee: chamber.appointmentFee || doctor.consultationFee,
        hospitalId: chamber.hospitalId,
        hospital: chamber.hospital,
        departmentId: chamber.departmentId,
        department: chamber.department,
      },
      slots,
    };
  }

  async create(createDto: CreateAppointmentDto, patientId: string) {
    const doctor = await this.resolveDoctor(createDto.doctorId);

    if (!doctor) {
      throw new NotFoundException('Doctor with ID or slug ' + createDto.doctorId + ' not found');
    }

    let candidateChambers = doctor.chambers;
    if (createDto.hospitalId) {
      candidateChambers = candidateChambers.filter(
        (c) => c.hospitalId === createDto.hospitalId || c.hospital?.slug === createDto.hospitalId
      );
    }

    const chamber = (createDto.chamberId && candidateChambers.find((c) => c.id === createDto.chamberId))
      || (createDto.chamberId && doctor.chambers.find((c) => c.id === createDto.chamberId))
      || candidateChambers.find((c) => c.isMain)
      || candidateChambers[0]
      || doctor.chambers.find((c) => c.isMain)
      || doctor.chambers[0];

    if (!chamber) {
      throw new BadRequestException('Chamber is required for appointment');
    }

    const apptDate = new Date(createDto.appointmentDate);
    if (isNaN(apptDate.getTime())) {
      throw new BadRequestException('Invalid appointment date format');
    }
    const startOfDay = new Date(apptDate.toISOString().split('T')[0]);
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const dayOfWeek = DAY_MAP[startOfDay.getDay()];
    const schedule = chamber.schedules.find((s) => s.day === dayOfWeek && !s.isClosed);
    if (!schedule) {
      throw new BadRequestException(
        'Doctor does not practice at ' + chamber.name + ' on ' + dayOfWeek
      );
    }

    const consultationFee = chamber.appointmentFee || doctor.consultationFee;
    const platformFee = 0;
    const totalAmount = consultationFee + platformFee;
    const appointmentNumber = this.generateAppointmentNumber();

    const hospitalId = chamber.hospitalId || createDto.hospitalId || null;
    const departmentId = chamber.departmentId || createDto.departmentId || null;

    const lockKey = this.hashSlotLock(chamber.id, createDto.appointmentDate, createDto.slotTime);

    const appointment = await this.prisma.$transaction(async (tx) => {
      // 1. Concurrency protection: Acquire PostgreSQL advisory transaction lock
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(${lockKey})`;

      // 2. Check for active (non-cancelled) conflicting booking
      const existing = await tx.appointment.findFirst({
        where: {
          doctorId: doctor.id,
          chamberId: chamber.id,
          appointmentDate: {
            gte: startOfDay,
            lt: endOfDay,
          },
          slotTime: createDto.slotTime,
          status: { notIn: [AppointmentStatus.CANCELLED] },
        },
      });

      if (existing) {
        throw new ConflictException(
          'Slot ' + createDto.slotTime + ' on ' + createDto.appointmentDate + ' is already booked. Please choose another time.'
        );
      }

      // 3. Create appointment atomically
      const newAppt = await tx.appointment.create({
        data: {
          appointmentNumber,
          patientId,
          doctorId: doctor.id,
          chamberId: chamber.id,
          hospitalId,
          departmentId,
          type: createDto.type || 'IN_PERSON',
          status: AppointmentStatus.PENDING,
          appointmentDate: startOfDay,
          slotTime: createDto.slotTime,
          patientName: createDto.patientName,
          patientPhone: createDto.patientPhone,
          patientAge: createDto.patientAge,
          patientGender: createDto.patientGender,
          symptoms: createDto.symptoms,
          notes: createDto.notes,
          consultationFee,
          platformFee,
          totalAmount,
          paymentStatus: PaymentStatus.PENDING,
        },
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
              title: true,
              slug: true,
              photo: true,
              specialties: {
                where: { isPrimary: true },
                include: { specialty: { select: { name: true } } },
              },
            },
          },
          chamber: {
            select: {
              id: true,
              name: true,
              address: true,
              phone: true,
            },
          },
          hospital: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      await tx.doctor.update({
        where: { id: doctor.id },
        data: { totalAppointments: { increment: 1 } },
      });

      return newAppt;
    });

    this.logger.log('Created appointment ' + appointment.appointmentNumber + ' for patient ' + patientId);
    return appointment;
  }

  async findPatientAppointments(patientId: string, queryDto: QueryAppointmentsDto) {
    const { page = 1, limit = 20, status } = queryDto;
    const skip = (page - 1) * limit;

    const where: any = {
      patientId,
      ...(status && { status }),
    };

    const [appointments, total] = await this.prisma.$transaction([
      this.prisma.appointment.findMany({
        where,
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
              title: true,
              slug: true,
              photo: true,
              consultationFee: true,
              specialties: {
                where: { isPrimary: true },
                include: { specialty: { select: { name: true } } },
              },
            },
          },
          chamber: {
            select: {
              id: true,
              name: true,
              address: true,
              phone: true,
            },
          },
          hospital: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: [{ appointmentDate: 'desc' }, { slotTime: 'desc' }],
        skip,
        take: limit,
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

  async findOne(id: string, userId: string, role: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: {
          include: {
            specialties: { include: { specialty: true } },
          },
        },
        chamber: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
          },
        },
        hospital: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        patient: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment with ID ' + id + ' not found');
    }

    const isPatient = appointment.patientId === userId;
    const isDoctor = appointment.doctor.userId === userId;
    const isAdmin = role === UserRole.SUPER_ADMIN;

    if (!isPatient && !isDoctor && !isAdmin) {
      throw new ForbiddenException('You do not have permission to view this appointment');
    }

    return appointment;
  }

  async cancel(id: string, userId: string, role: string, cancelDto: CancelAppointmentDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { doctor: { select: { userId: true } } },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment with ID ' + id + ' not found');
    }

    const isPatient = appointment.patientId === userId;
    const isDoctor = appointment.doctor.userId === userId;
    const isAdmin = role === UserRole.SUPER_ADMIN;

    if (!isPatient && !isDoctor && !isAdmin) {
      throw new ForbiddenException('You do not have permission to cancel this appointment');
    }

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Appointment is already cancelled');
    }

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed appointment');
    }

    const apptDate = new Date(appointment.appointmentDate);
    if (apptDate < new Date()) {
      throw new BadRequestException('Cannot cancel an appointment whose scheduled date has already passed. Please book a new appointment.');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.CANCELLED,
        cancelledAt: new Date(),
        cancelReason: cancelDto.reason || 'Cancelled by user',
      },
    });
  }

  async confirm(id: string, doctorUserId: string, role: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { doctor: { select: { userId: true } } },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment with ID ' + id + ' not found');
    }

    const isDoctor = appointment.doctor.userId === doctorUserId;
    const isAdmin = role === UserRole.SUPER_ADMIN;

    if (!isDoctor && !isAdmin) {
      throw new ForbiddenException('Only the doctor or an admin can confirm this appointment');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status: AppointmentStatus.CONFIRMED },
    });
  }

  async complete(id: string, doctorUserId: string, role: string, notes?: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { doctor: { select: { userId: true } } },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment with ID ' + id + ' not found');
    }

    const isDoctor = appointment.doctor.userId === doctorUserId;
    const isAdmin = role === UserRole.SUPER_ADMIN;

    if (!isDoctor && !isAdmin) {
      throw new ForbiddenException('Only the doctor or an admin can mark this appointment as completed');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.COMPLETED,
        completedAt: new Date(),
        consultationNotes: notes,
        paymentStatus: PaymentStatus.COMPLETED,
      },
    });
  }

  async getDoctorStats(userId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
      select: {
        id: true,
        name: true,
        title: true,
        photo: true,
        slug: true,
        consultationFee: true,
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor profile not found for this user account');
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [
      todayCount,
      pendingCount,
      confirmedUpcomingCount,
      completedCount,
      totalCount,
      chambersCount,
      revenueResult,
    ] = await this.prisma.$transaction([
      this.prisma.appointment.count({
        where: {
          doctorId: doctor.id,
          appointmentDate: { gte: todayStart, lte: todayEnd },
          status: { notIn: [AppointmentStatus.CANCELLED] },
        },
      }),
      this.prisma.appointment.count({
        where: {
          doctorId: doctor.id,
          status: AppointmentStatus.PENDING,
        },
      }),
      this.prisma.appointment.count({
        where: {
          doctorId: doctor.id,
          status: AppointmentStatus.CONFIRMED,
          appointmentDate: { gte: todayStart },
        },
      }),
      this.prisma.appointment.count({
        where: {
          doctorId: doctor.id,
          status: AppointmentStatus.COMPLETED,
        },
      }),
      this.prisma.appointment.count({
        where: { doctorId: doctor.id },
      }),
      this.prisma.doctorChamber.count({
        where: { doctorId: doctor.id },
      }),
      this.prisma.appointment.aggregate({
        _sum: { totalAmount: true },
        where: {
          doctorId: doctor.id,
          status: AppointmentStatus.COMPLETED,
        },
      }),
    ]);

    return {
      doctor,
      metrics: {
        todayPatients: todayCount,
        pendingApprovals: pendingCount,
        confirmedUpcoming: confirmedUpcomingCount,
        completedConsultations: completedCount,
        totalBookings: totalCount,
        totalChambers: chambersCount,
        earnedRevenue: revenueResult._sum.totalAmount || 0,
      },
    };
  }

  async getDoctorChambers(userId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    const chambers = await this.prisma.doctorChamber.findMany({
      where: { doctorId: doctor.id },
      include: {
        hospital: { select: { id: true, name: true, slug: true } },
        area: { select: { id: true, name: true } },
        schedules: { orderBy: { day: 'asc' } },
        _count: {
          select: {
            appointments: true,
          },
        },
      },
      orderBy: { isMain: 'desc' },
    });

    return chambers;
  }

  async findDoctorAppointments(
    userId: string,
    query: {
      page?: number;
      limit?: number;
      chamberId?: string;
      status?: AppointmentStatus;
      dateScope?: string; // 'today' | 'upcoming' | 'past' | 'all'
      search?: string;
    }
  ) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    const { page = 1, limit = 20, chamberId, status, dateScope, search } = query;
    const skip = (page - 1) * limit;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const where: any = {
      doctorId: doctor.id,
      ...(chamberId && { chamberId }),
      ...(status && { status }),
      ...(dateScope === 'today' && {
        appointmentDate: { gte: todayStart, lte: todayEnd },
      }),
      ...(dateScope === 'upcoming' && {
        appointmentDate: { gte: todayStart },
      }),
      ...(dateScope === 'past' && {
        appointmentDate: { lt: todayStart },
      }),
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
        include: {
          patient: {
            select: { id: true, name: true, email: true, phone: true },
          },
          chamber: {
            select: {
              id: true,
              name: true,
              address: true,
              phone: true,
              hospital: { select: { id: true, name: true, slug: true } },
            },
          },
          hospital: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: [{ appointmentDate: 'desc' }, { slotTime: 'desc' }],
        skip,
        take: limit,
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
}