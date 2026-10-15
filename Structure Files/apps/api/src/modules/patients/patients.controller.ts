import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('patients')
@Controller({ path: 'patients', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get overview statistics and next appointment for authenticated patient' })
  @ApiResponse({ status: 200, description: 'Patient stats returned successfully' })
  getStats(@CurrentUser('id') userId: string) {
    return this.patientsService.getStats(userId);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get full profile of the authenticated patient' })
  @ApiResponse({ status: 200, description: 'Profile returned successfully' })
  getProfile(@CurrentUser('id') userId: string) {
    return this.patientsService.getProfile(userId);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update profile information for authenticated patient' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 409, description: 'Phone number already registered' })
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdatePatientProfileDto,
  ) {
    return this.patientsService.updateProfile(userId, dto);
  }

  @Get('saved-doctors')
  @ApiOperation({ summary: 'List all doctors saved/bookmarked by authenticated patient' })
  @ApiResponse({ status: 200, description: 'Saved doctors list' })
  getSavedDoctors(@CurrentUser('id') userId: string) {
    return this.patientsService.getSavedDoctors(userId);
  }

  @Post('saved-doctors/:doctorId')
  @ApiOperation({ summary: 'Bookmark/save a doctor' })
  @ApiResponse({ status: 201, description: 'Doctor saved successfully' })
  @ApiResponse({ status: 404, description: 'Doctor not found' })
  saveDoctor(
    @CurrentUser('id') userId: string,
    @Param('doctorId') doctorId: string,
  ) {
    return this.patientsService.saveDoctor(userId, doctorId);
  }

  @Delete('saved-doctors/:doctorId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a saved doctor from bookmarks' })
  @ApiResponse({ status: 200, description: 'Doctor removed from saved list' })
  unsaveDoctor(
    @CurrentUser('id') userId: string,
    @Param('doctorId') doctorId: string,
  ) {
    return this.patientsService.unsaveDoctor(userId, doctorId);
  }

  @Get('saved-doctors/check/:doctorId')
  @ApiOperation({ summary: 'Check if a specific doctor is bookmarked by current user' })
  @ApiResponse({ status: 200, description: 'Saved status checked' })
  checkSavedDoctor(
    @CurrentUser('id') userId: string,
    @Param('doctorId') doctorId: string,
  ) {
    return this.patientsService.checkSavedDoctor(userId, doctorId);
  }
}
