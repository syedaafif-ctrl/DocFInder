// apps/api/src/modules/appointments/appointments.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentsService } from '../payments/payments.service';
import { AppointmentStatus, PaymentStatus } from '@prisma/client';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async create(createDto: CreateAppointmentDto, patientId: string) {
    // Validate doctor exists and is active
    const doctor = await this.prisma.doctor.findFirst({
      where: { id: createDto.doctorId, status: 'ACTIVE' },
      include: { chambers: { include: { schedules: true } } },
    });
    if (!doctor) throw new NotFoundException('Doctor not found or not active');

    // Validate chamber
    const chamber = doctor.chambers.find((c) => c.id === createDto.chamberId);
    if (!chamber) throw new NotFoundException('Chamber not found');

    // Check if slot is available
    const existingAppointment = await this.prisma.appointment.findFirst({
      where: {
        doctorId: createDto.doctorId,
        chamberId: createDto.chamberId,
        appointmentDate: {
          gte: new Date(createDto.appointmentDate),
          lt: new Date(new Date(createDto.appointmentDate).getTime() + 24 * 60 * 60 * 1000),
        },
        slotTime: createDto.slotTime,
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
      },
    });

    if (existingAppointment) {
      throw new ConflictException('This time slot is already booked. Please choose another time.');
    }

    // Check availability override
    const override = await this.prisma.availabilityOverride.findUnique({
      where: {
        doctorId_date: {
          doctorId: createDto.doctorId,
          date: new Date(createDto.appointmentDate),
        },
      },
    });
    if (override && !override.isAvailable) {
      throw new BadRequestException('Doctor is not available on this date');
    }

    // Validate time slot
    const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const dayOfWeek = dayNames[new Date(createDto.appointmentDate).getDay()];
    const schedule = chamber.schedules.find((s) => s.day === dayOfWeek);

    if (!schedule || schedule.isClosed) {
      throw new BadRequestException('Doctor does not have appointments on this day');
    }

    // Calculate fees
    const consultationFee = chamber.appointmentFee || doctor.consultationFee;
    const platformFee = Math.round(consultationFee * 0.05); // 5% platform fee
    const totalAmount = consultationFee + platformFee;

    // Generate appointment number
    const appointmentNumber = `SBD-${new Date().getFullYear()}-${nanoid(8).toUpperCase()}`;

    const appointment = await this.prisma.appointment.create({
      data: {
        appointmentNumber,
        patientId,
        doctorId: createDto.doctorId,
        chamberId: createDto.chamberId,
        type: createDto.type || 'IN_PERSON',
        status: AppointmentStatus.PENDING,
        appointmentDate: new Date(createDto.appointmentDate),
        slotTime: createDto.slotTime,
        symptoms: createDto.symptoms,
        notes: createDto.notes,
        patientName: createDto.patientName,
        patientPhone: createDto.patientPhone,
        patientAge: createDto.patientAge,
        patientGender: createDto.patientGender,
        consultationFee,
        platformFee,
        totalAmount,
        paymentStatus: PaymentStatus.PENDING,
      },
      include: {
        doctor: {
          select: { id: true, name: true, phone: true, slug: true },
        },
        patient: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    // Send confirmation notifications
    await Promise.allSettled([
      this.notificationsService.sendAppointmentConfirmation(appointment),
      this.notificationsService.notifyDoctorNewAppointment(appointment),
    ]);

    // Update doctor appointment count
    await this.prisma.doctor.update({
      where: { id: createDto.doctorId },
      data: { totalAppointments: { increment: 1 } },
    });

    return appointment;
  }

  async findPatientAppointments(patientId: string, paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const [appointments, total] = await this.prisma.$transaction([
      this.prisma.appointment.findMany({
        where: { patientId },
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
              photo: true,
              slug: true,
              specialties: {
                include: { specialty: { select: { name: true } } },
                where: { isPrimary: true },
              },
            },
          },
        },
        orderBy: { appointmentDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.appointment.count({ where: { patientId } }),
    ]);

    return { data: appointments, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findDoctorAppointments(doctorId: string, date?: string, paginationDto: PaginationDto = {}) {
    const { page = 1, limit = 20 } = paginationDto;
    const where: any = { doctorId };

    if (date) {
      where.appointmentDate = {
        gte: new Date(date),
        lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
      };
    }

    const [appointments, total] = await this.prisma.$transaction([
      this.prisma.appointment.findMany({
        where,
        include: {
          patient: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
        },
        orderBy: [{ appointmentDate: 'asc' }, { slotTime: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return { data: appointments, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string, userId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: {
          include: {
            specialties: { include: { specialty: true }, where: { isPrimary: true } },
          },
        },
        patient: { select: { id: true, name: true, email: true, phone: true } },
        payment: true,
        review: true,
      },
    });

    if (!appointment) throw new NotFoundException('Appointment not found');
    if (appointment.patientId !== userId && appointment.doctor.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return appointment;
  }

  async cancel(id: string, userId: string, reason?: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { doctor: { select: { userId: true } } },
    });

    if (!appointment) throw new NotFoundException('Appointment not found');
    if (appointment.patientId !== userId && appointment.doctor.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (!['PENDING', 'CONFIRMED'].includes(appointment.status)) {
      throw new BadRequestException(`Cannot cancel appointment with status: ${appointment.status}`);
    }

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.CANCELLED,
        cancelledAt: new Date(),
        cancelReason: reason,
      },
    });

    // Process refund if payment was made
    if (appointment.paymentStatus === 'COMPLETED') {
      await this.paymentsService.processRefund(appointment.id, appointment.totalAmount, 'Appointment cancelled');
    }

    await this.notificationsService.sendAppointmentCancellation(updatedAppointment, reason);

    return updatedAppointment;
  }

  async confirm(id: string, doctorUserId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { doctor: { select: { userId: true } } },
    });

    if (!appointment) throw new NotFoundException('Appointment not found');
    if (appointment.doctor.userId !== doctorUserId) throw new ForbiddenException('Access denied');

    if (appointment.status !== 'PENDING') {
      throw new BadRequestException('Can only confirm pending appointments');
    }

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: { status: AppointmentStatus.CONFIRMED },
    });

    await this.notificationsService.sendAppointmentConfirmation(updated);
    return updated;
  }

  async complete(id: string, doctorUserId: string, notes?: string, prescriptionUrl?: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { doctor: { select: { userId: true } } },
    });

    if (!appointment) throw new NotFoundException('Appointment not found');
    if (appointment.doctor.userId !== doctorUserId) throw new ForbiddenException('Access denied');

    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.COMPLETED,
        completedAt: new Date(),
        consultationNotes: notes,
        prescriptionUrl,
        paymentStatus: PaymentStatus.COMPLETED,
      },
    });
  }

  async reschedule(id: string, userId: string, newDate: string, newSlot: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { doctor: { select: { userId: true } } },
    });

    if (!appointment) throw new NotFoundException('Appointment not found');
    if (appointment.patientId !== userId) throw new ForbiddenException('Access denied');

    if (!['PENDING', 'CONFIRMED'].includes(appointment.status)) {
      throw new BadRequestException('Cannot reschedule this appointment');
    }

    // Check new slot availability
    const conflict = await this.prisma.appointment.findFirst({
      where: {
        doctorId: appointment.doctorId,
        chamberId: appointment.chamberId,
        appointmentDate: {
          gte: new Date(newDate),
          lt: new Date(new Date(newDate).getTime() + 24 * 60 * 60 * 1000),
        },
        slotTime: newSlot,
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
        id: { not: id },
      },
    });

    if (conflict) throw new ConflictException('New time slot is already booked');

    return this.prisma.appointment.update({
      where: { id },
      data: {
        appointmentDate: new Date(newDate),
        slotTime: newSlot,
        status: AppointmentStatus.CONFIRMED,
        rescheduledFrom: appointment.slotTime,
      },
    });
  }

  async adminFindAll(filters: any, paginationDto: PaginationDto) {
    const { page = 1, limit = 20 } = paginationDto;
    const where: any = {
      ...(filters.status && { status: filters.status }),
      ...(filters.doctorId && { doctorId: filters.doctorId }),
      ...(filters.startDate && { appointmentDate: { gte: new Date(filters.startDate) } }),
      ...(filters.endDate && { appointmentDate: { lte: new Date(filters.endDate) } }),
    };

    const [appointments, total] = await this.prisma.$transaction([
      this.prisma.appointment.findMany({
        where,
        include: {
          doctor: { select: { id: true, name: true, slug: true } },
          patient: { select: { id: true, name: true, email: true, phone: true } },
          payment: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return { data: appointments, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getRevenueStats(startDate: Date, endDate: Date) {
    const appointments = await this.prisma.appointment.groupBy({
      by: ['status'],
      _count: { id: true },
      _sum: { totalAmount: true, platformFee: true },
      where: {
        createdAt: { gte: startDate, lte: endDate },
      },
    });

    return appointments;
  }
}
