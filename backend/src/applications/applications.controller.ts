// src/applications/applications.controller.ts
import { Controller, Get, Patch, Body, Param, UseGuards, 
  UseInterceptors, UploadedFiles } from '@nestjs/common';
import {
  UpdatePersonalDetailsDto, UpdateEducationDto, UpdatePreferencesDto,
  UpdateTestsDto, UpdateWorkExperienceDto, UpdateVisaDetailsDto,
} from './dto/update-sections.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator'; // <--- IMPORT THIS

@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get(':leadId')
  getOne(@Param('leadId') leadId: string, @GetUser() user: any) {
    return this.applicationsService.getFullApplication(leadId, user);
  }

  @Patch(':leadId/personal')
  updatePersonal(@Param('leadId') leadId: string, @Body() dto: UpdatePersonalDetailsDto, @GetUser() user: any) {
    return this.applicationsService.updatePersonalDetails(leadId, dto, user);
  }

  @Patch(':leadId/education')
  updateEducation(@Param('leadId') leadId: string, @Body() dto: UpdateEducationDto, @GetUser() user: any) {
    return this.applicationsService.updateEducation(leadId, dto, user);
  }

  @Patch(':leadId/preferences')
  updatePreferences(@Param('leadId') leadId: string, @Body() dto: UpdatePreferencesDto, @GetUser() user: any) {
    return this.applicationsService.updatePreferences(leadId, dto, user);
  }

  @Patch(':leadId/tests')
  updateTests(@Param('leadId') leadId: string, @Body() dto: UpdateTestsDto, @GetUser() user: any) {
    return this.applicationsService.updateTests(leadId, dto, user);
  }

  @Patch(':leadId/work-experience')
  updateWorkExperience(@Param('leadId') leadId: string, @Body() dto: UpdateWorkExperienceDto, @GetUser() user: any) {
    return this.applicationsService.updateWorkExperience(leadId, dto, user);
  }

  @Patch(':leadId/visa')
  updateVisa(@Param('leadId') leadId: string, @Body() dto: UpdateVisaDetailsDto, @GetUser() user: any) {
    return this.applicationsService.updateVisaDetails(leadId, dto, user);
  }

  @Patch(':leadId/documents')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profile_photo', maxCount: 1 },
      { name: 'passport_copy', maxCount: 1 },
      { name: 'academic_documents', maxCount: 10 },
      { name: 'english_test_cert', maxCount: 1 },
      { name: 'sop', maxCount: 1 },
      { name: 'cv_resume', maxCount: 1 },
      { name: 'recommendation_letters', maxCount: 5 },
      { name: 'financial_documents', maxCount: 1 },
      { name: 'other_documents', maxCount: 1 },
    ]),
  )
  updateDocuments(
    @Param('leadId') leadId: string,
    @UploadedFiles() files: any,
    @GetUser() user: any, // <--- Inject User
  ) {
    return this.applicationsService.updateDocuments(leadId, files, user);
  }
}