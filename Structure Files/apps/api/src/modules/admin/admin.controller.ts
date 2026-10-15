import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { AdminService } from './admin.service';
import {
  AdminDoctorQueryDto,
  UpdateDoctorStatusDto,
  UpdateDoctorVerificationDto,
  AdminAppointmentQueryDto,
  AdminUserQueryDto,
  UpdateUserStatusDto,
  UpdateReviewStatusDto,
} from './dto/admin-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('admin')
@Controller({ path: 'admin', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Platform KPI overview statistics and pending queues' })
  @ApiResponse({ status: 200, description: 'Overview statistics' })
  getOverviewStats() {
    return this.adminService.getOverviewStats();
  }

  @Get('doctors')
  @ApiOperation({ summary: 'Paginated list of all platform doctors with status filters' })
  getDoctors(@Query() query: AdminDoctorQueryDto) {
    return this.adminService.getDoctors(query);
  }

  @Patch('doctors/:id/status')
  @ApiOperation({ summary: 'Approve, reject, or suspend a doctor account' })
  updateDoctorStatus(
    @Param('id') id: string,
    @Body() dto: UpdateDoctorStatusDto,
  ) {
    return this.adminService.updateDoctorStatus(id, dto.status);
  }

  @Patch('doctors/:id/verification')
  @ApiOperation({ summary: 'Update doctor BMDC verification status' })
  updateDoctorVerification(
    @Param('id') id: string,
    @Body() dto: UpdateDoctorVerificationDto,
  ) {
    return this.adminService.updateDoctorVerification(id, dto);
  }

  @Patch('doctors/:id/featured')
  @ApiOperation({ summary: 'Toggle doctor featured spotlight on homepage' })
  toggleDoctorFeatured(@Param('id') id: string) {
    return this.adminService.toggleDoctorFeatured(id);
  }

  @Get('hospitals')
  @ApiOperation({ summary: 'Paginated list of all hospitals' })
  getHospitals(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.adminService.getHospitals(Number(page) || 1, Number(limit) || 20, search);
  }

  @Patch('hospitals/:id/featured')
  @ApiOperation({ summary: 'Toggle hospital featured badge' })
  toggleHospitalFeatured(@Param('id') id: string) {
    return this.adminService.toggleHospitalFeatured(id);
  }

  @Patch('hospitals/:id/verified')
  @ApiOperation({ summary: 'Toggle hospital verified badge' })
  toggleHospitalVerified(@Param('id') id: string) {
    return this.adminService.toggleHospitalVerified(id);
  }

  @Get('appointments')
  @ApiOperation({ summary: 'Global appointments monitor with search and status filters' })
  getAppointments(@Query() query: AdminAppointmentQueryDto) {
    return this.adminService.getAppointments(query);
  }

  @Get('users')
  @ApiOperation({ summary: 'Paginated list of all user accounts' })
  getUsers(@Query() query: AdminUserQueryDto) {
    return this.adminService.getUsers(query);
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Suspend or activate user account' })
  updateUserStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.adminService.updateUserStatus(id, dto.status);
  }

  @Get('reviews')
  @ApiOperation({ summary: 'List patient reviews for moderation' })
  getReviews(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: any,
  ) {
    return this.adminService.getReviews(Number(page) || 1, Number(limit) || 20, status);
  }

  @Patch('reviews/:id/status')
  @ApiOperation({ summary: 'Moderate review (Approve, Flag, Reject)' })
  updateReviewStatus(
    @Param('id') id: string,
    @Body() dto: UpdateReviewStatusDto,
  ) {
    return this.adminService.updateReviewStatus(id, dto.status);
  }
}
