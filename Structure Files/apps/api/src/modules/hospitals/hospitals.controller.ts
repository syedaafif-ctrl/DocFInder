import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HospitalsService } from './hospitals.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { SearchHospitalsDto } from './dto/search-hospitals.dto';

@ApiTags('hospitals')
@Controller({ path: 'hospitals', version: '1' })
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Get()
  @ApiOperation({ summary: 'List active hospitals, paginated' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.hospitalsService.findAll(paginationDto);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured hospitals for homepage' })
  getFeatured() {
    return this.hospitalsService.getFeaturedHospitals();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search hospitals with filters' })
  search(@Query() searchDto: SearchHospitalsDto) {
    return this.hospitalsService.search(searchDto);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get full hospital profile by slug' })
  findOne(@Param('slug') slug: string) {
    return this.hospitalsService.findOne(slug);
  }
}