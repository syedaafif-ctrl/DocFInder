import { IsOptional, IsString, IsBoolean, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

const SORT_OPTIONS = ['featured', 'rating', 'beds', 'newest'] as const;

export class SearchHospitalsDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({ description: 'Private | Government | Diagnostic | Clinic' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  districtSlug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isEmergency?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isVerified?: boolean;

  @ApiPropertyOptional({ enum: SORT_OPTIONS })
  @IsOptional()
  @IsIn(SORT_OPTIONS)
  sortBy?: (typeof SORT_OPTIONS)[number] = 'featured';
}