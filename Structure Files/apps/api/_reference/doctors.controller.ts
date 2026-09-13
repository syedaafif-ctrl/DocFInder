// apps/api/src/modules/doctors/doctors.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { SearchDoctorsDto } from './dto/search-doctors.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CloudinaryService } from '../../common/services/cloudinary.service';

@ApiTags('doctors')
@Controller({ path: 'doctors', version: '1' })
export class DoctorsController {
  constructor(
    private readonly doctorsService: DoctorsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new doctor profile' })
  create(@Body() createDoctorDto: CreateDoctorDto, @Request() req: any) {
    return this.doctorsService.create(createDoctorDto, req.user.id);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all active doctors with pagination' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.doctorsService.findAll(paginationDto);
  }

  @Get('featured')
  @Public()
  @ApiOperation({ summary: 'Get featured doctors for homepage' })
  getFeatured() {
    return this.doctorsService.getFeaturedDoctors();
  }

  @Get('trending')
  @Public()
  @ApiOperation({ summary: 'Get trending doctors' })
  getTrending() {
    return this.doctorsService.getTrendingDoctors();
  }

  @Get('search')
  @Public()
  @ApiOperation({ summary: 'Advanced doctor search with filters' })
  search(@Query() searchDto: SearchDoctorsDto) {
    return this.doctorsService.search(searchDto);
  }

  @Get('saved')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user\'s saved doctors' })
  getSaved(@Request() req: any) {
    return this.doctorsService.getSavedDoctors(req.user.id);
  }

  @Get(':districtSlug/:specialtySlug')
  @Public()
  @ApiOperation({ summary: 'Get doctors by specialty and district (SEO pages)' })
  findBySpecialtyAndDistrict(
    @Param('specialtySlug') specialtySlug: string,
    @Param('districtSlug') districtSlug: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.doctorsService.searchBySpecialtyAndDistrict(specialtySlug, districtSlug, paginationDto);
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Get doctor profile by slug' })
  findOne(@Param('slug') slug: string) {
    return this.doctorsService.findOne(slug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update doctor profile' })
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto, @Request() req: any) {
    return this.doctorsService.update(id, updateDoctorDto, req.user.id);
  }

  @Post(':id/photo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('photo'))
  @ApiOperation({ summary: 'Upload doctor profile photo' })
  async uploadPhoto(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() req: any,
  ) {
    const result = await this.cloudinaryService.uploadImage(file.buffer, {
      folder: 'doctors',
      publicId: `doctor-${id}`,
      transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
    });

    return this.doctorsService.update(id, { photo: result.secure_url } as any, req.user.id);
  }

  @Get(':id/slots')
  @Public()
  @ApiOperation({ summary: 'Get available appointment slots' })
  getSlots(
    @Param('id') id: string,
    @Query('chamberId') chamberId: string,
    @Query('date') date: string,
  ) {
    return this.doctorsService.getAvailableSlots(id, chamberId, date);
  }

  @Post(':id/chambers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new chamber for the doctor' })
  addChamber(@Param('id') id: string, @Body() chamberData: any, @Request() req: any) {
    return this.doctorsService.addChamber(id, chamberData);
  }

  @Patch(':id/availability')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update chamber availability schedules' })
  updateAvailability(
    @Param('id') id: string,
    @Body() body: { chamberId: string; schedules: any[] },
    @Request() req: any,
  ) {
    return this.doctorsService.updateAvailability(id, body.chamberId, body.schedules);
  }

  @Post(':id/save')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Save/bookmark a doctor' })
  saveDoctor(@Param('id') id: string, @Request() req: any) {
    return this.doctorsService.saveDoctor(req.user.id, id);
  }

  @Delete(':id/save')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove saved doctor' })
  unsaveDoctor(@Param('id') id: string, @Request() req: any) {
    return this.doctorsService.unsaveDoctor(req.user.id, id);
  }

  @Get(':id/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get doctor analytics stats (for dashboard)' })
  getStats(@Param('id') id: string, @Request() req: any) {
    return this.doctorsService.getStatsByDoctor(id, req.user.id);
  }
}
