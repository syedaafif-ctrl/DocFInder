import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { QueryAppointmentsDto } from './dto/query-appointments.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('appointments')
@Controller({ path: 'appointments', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Public()
  @Get('doctor/:doctorId/slots')
  @ApiOperation({ summary: 'Get available time slots for a doctor on a specific date' })
  getSlots(
    @Param('doctorId') doctorId: string,
    @Query('date') date: string,
    @Query('chamberId') chamberId?: string,
  ) {
    return this.appointmentsService.getDoctorSlots(doctorId, date, chamberId);
  }

  @Post()
  @ApiOperation({ summary: 'Book an appointment (requires authentication)' })
  create(@CurrentUser() user: any, @Body() createDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createDto, user.id);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get appointments for currently authenticated patient' })
  findMy(@CurrentUser() user: any, @Query() queryDto: QueryAppointmentsDto) {
    return this.appointmentsService.findPatientAppointments(user.id, queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a specific appointment' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.appointmentsService.findOne(id, user.id, user.role);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel an appointment' })
  cancel(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() cancelDto: CancelAppointmentDto,
  ) {
    return this.appointmentsService.cancel(id, user.id, user.role, cancelDto);
  }

  @Patch(':id/confirm')
  @ApiOperation({ summary: 'Confirm an appointment (Doctor/Admin only)' })
  confirm(@CurrentUser() user: any, @Param('id') id: string) {
    return this.appointmentsService.confirm(id, user.id, user.role);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Mark appointment as completed (Doctor/Admin only)' })
  complete(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body('notes') notes?: string,
  ) {
    return this.appointmentsService.complete(id, user.id, user.role, notes);
  }
}
