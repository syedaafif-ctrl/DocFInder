import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@prisma/client';

export class UpdatePatientProfileDto {
  @ApiPropertyOptional({ description: 'Full name of the user', example: 'Tanvir Hossain' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ description: 'Name in Bengali script', example: 'তানভীর হোসেন' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nameBn?: string;

  @ApiPropertyOptional({ description: 'Bangladeshi phone number', example: '+8801712345678' })
  @IsOptional()
  @IsString()
  @Matches(/^(\+?880|0)?1[3-9]\d{8}$/, {
    message: 'Please provide a valid Bangladeshi mobile number (e.g., 01712345678 or +8801712345678)',
  })
  phone?: string;

  @ApiPropertyOptional({ enum: Gender, description: 'User gender' })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({ description: 'Date of birth in ISO format (YYYY-MM-DD)', example: '1995-05-15' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ description: 'Preferred language (en or bn)', example: 'en' })
  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  @ApiPropertyOptional({ description: 'Avatar URL' })
  @IsOptional()
  @IsString()
  avatar?: string;
}
