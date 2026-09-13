import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
  IsDateString,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentType, Gender } from '@prisma/client';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'ID of the Doctor' })
  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @ApiPropertyOptional({ description: 'ID of the Doctor Chamber (optional if online)' })
  @IsOptional()
  @IsString()
  chamberId?: string;

  @ApiPropertyOptional({ enum: AppointmentType, default: AppointmentType.IN_PERSON })
  @IsOptional()
  @IsEnum(AppointmentType)
  type?: AppointmentType = AppointmentType.IN_PERSON;

  @ApiProperty({ description: 'Appointment date in YYYY-MM-DD format', example: '2026-09-20' })
  @IsDateString()
  @IsNotEmpty()
  appointmentDate: string;

  @ApiProperty({ description: 'Time slot (e.g. 10:00, 10:30, 14:15)', example: '10:00' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'slotTime must be in HH:mm 24-hour format (e.g. 10:00)',
  })
  slotTime: string;

  @ApiProperty({ description: 'Patient full name' })
  @IsString()
  @IsNotEmpty()
  patientName: string;

  @ApiProperty({ description: 'Patient phone number', example: '+8801712345678' })
  @IsString()
  @IsNotEmpty()
  patientPhone: string;

  @ApiPropertyOptional({ description: 'Patient age' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(130)
  patientAge?: number;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  patientGender?: Gender;

  @ApiPropertyOptional({ description: 'Primary symptoms or reason for appointment' })
  @IsOptional()
  @IsString()
  symptoms?: string;

  @ApiPropertyOptional({ description: 'Additional notes for the doctor' })
  @IsOptional()
  @IsString()
  notes?: string;
}
