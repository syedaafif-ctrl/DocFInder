import { IsOptional, IsString, IsBoolean, IsInt, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

const SORT_OPTIONS = ['relevance', 'rating', 'experience', 'fee_low', 'fee_high', 'popular', 'newest'] as const;

export class SearchDoctorsDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  specialtySlug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  districtSlug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  areaId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  minFee?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  maxFee?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  minExperience?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isAvailableOnline?: boolean;

  @ApiPropertyOptional({ enum: SORT_OPTIONS })
  @IsOptional()
  @IsIn(SORT_OPTIONS)
  sortBy?: (typeof SORT_OPTIONS)[number] = 'relevance';
}