import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'Rafiqul Islam', description: 'User full name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'rafiqul@example.com', description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecureP@ss123', description: 'Password (min 6 characters)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: '+8801712345678', description: 'Mobile phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    enum: [UserRole.PATIENT, UserRole.DOCTOR],
    default: UserRole.PATIENT,
    description: 'Role for registration (defaults to PATIENT)',
  })
  @IsOptional()
  @IsEnum([UserRole.PATIENT, UserRole.DOCTOR], {
    message: 'Role must be either PATIENT or DOCTOR during direct registration',
  })
  role?: UserRole = UserRole.PATIENT;
}
