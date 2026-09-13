import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { SearchDoctorsDto } from './dto/search-doctors.dto';

@ApiTags('doctors')
@Controller({ path: 'doctors', version: '1' })
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  @ApiOperation({ summary: 'List active doctors, paginated' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.doctorsService.findAll(paginationDto);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured doctors for homepage' })
  getFeatured() {
    return this.doctorsService.getFeaturedDoctors();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search doctors with filters' })
  search(@Query() searchDto: SearchDoctorsDto) {
    return this.doctorsService.search(searchDto);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get full doctor profile by slug' })
  findOne(@Param('slug') slug: string) {
    return this.doctorsService.findOne(slug);
  }
}