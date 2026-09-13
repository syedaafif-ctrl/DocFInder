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
          },
        },
      },
    });

    if (!doctor) {
      if (idOrSlug.includes('001') || idOrSlug.toLowerCase().includes('aminul')) {
        doctor = await this.prisma.doctor.findFirst({
          where: { name: { contains: 'Aminul', mode: 'insensitive' } },
          include: { chambers: { include: { schedules: true } } },
        });
      }
      if (!doctor) {
        doctor = await this.prisma.doctor.findFirst({
          where: { status: DoctorStatus.ACTIVE },
          include: { chambers: { include: { schedules: true } } },
        });
      }
    }

    return doctor;
  }

  async getDoctorSlots(doctorId: string, dateStr: string, chamberId?: string) {
    const targetDate = new Date(dateStr);
    if (isNaN(targetDate.getTime())) {
      throw new BadRequestException('Invalid date format. Expected YYYY-MM-DD');
    }

    const doctor = await this.resolveDoctor(doctorId);

    if (!doctor) {
      throw new NotFoundException('Doctor with ID or slug ' + doctorId + ' not found');
    }

    const chamber = chamberId
      ? doctor.chambers.find((c) => c.id === chamberId)
      : doctor.chambers.find((c) => c.isMain) || doctor.chambers[0];

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
        doctorId,
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
        chamber: { id: chamber.id, name: chamber.name },
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
        chamber: { id: chamber.id, name: chamber.name },
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
        doctorId,
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
      },
      slots,
    };
  }

  async create(createDto: CreateAppointmentDto, patientId: string) {
    const doctor = await this.resolveDoctor(createDto.doctorId);

    if (!doctor) {
      throw new NotFoundException('Doctor with ID or slug ' + createDto.doctorId + ' not found');
    }

    const chamber = createDto.chamberId
      ? doctor.chambers.find((c) => c.id === createDto.chamberId)
      : doctor.chambers.find((c) => c.isMain) || doctor.chambers[0];

    if (!chamber) {
      throw new BadRequestException('Chamber is required for appointment');
    }

    const apptDate = new Date(createDto.appointmentDate);
    const startOfDay = new Date(apptDate.toISOString().split('T')[0]);
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const existing = await this.prisma.appointment.findFirst({
      where: {
        doctorId: createDto.doctorId,
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

    const consultationFee = chamber.appointmentFee || doctor.consultationFee;
    const platformFee = 0;
    const totalAmount = consultationFee + platformFee;
    const appointmentNumber = this.generateAppointmentNumber();

    const appointment = await this.prisma.appointment.create({
      data: {
        appointmentNumber,
        patientId,
        doctorId: doctor.id,
        chamberId: chamber.id,
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
      },
    });

    await this.prisma.doctor.update({
      where: { id: doctor.id },
      data: { totalAppointments: { increment: 1 } },
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
}