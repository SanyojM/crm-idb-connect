// src/applications/applications.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UpdatePersonalDetailsDto, UpdateEducationDto, UpdatePreferencesDto,
  UpdateTestsDto, UpdateWorkExperienceDto, UpdateVisaDetailsDto,
} from './dto/update-sections.dto';
import { SupabaseService } from '../storage/supabase.service';
import { getScope } from '../common/utils/scope.util'; // <--- IMPORT SCOPE

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService, private supabaseService: SupabaseService) {}

  // 🔒 SECURITY HELPER
  private async validateLeadAccess(leadId: string, user: any) {
    const scope = getScope(user);
    const lead = await this.prisma.leads.findFirst({
      where: {
        id: leadId,
        ...scope // <--- Enforces Branch/User Scope
      }
    });

    if (!lead) {
      throw new ForbiddenException('You do not have access to this Lead.');
    }
  }

  // Helper: Find or Create Application
  private async getOrCreateApplication(leadId: string) {
    let app = await this.prisma.applications.findFirst({ where: { lead_id: leadId } });
    if (!app) {
      const studentId = `STU-${Date.now().toString().slice(-6)}`;
      app = await this.prisma.applications.create({
        data: { lead_id: leadId, student_id: studentId },
      });
    }
    return app;
  }

  // 1. Personal Details (Updated to accept User)
  async updatePersonalDetails(leadId: string, dto: UpdatePersonalDetailsDto, user: any) {
    await this.validateLeadAccess(leadId, user); // <--- CHECK PERMISSION

    const app = await this.getOrCreateApplication(leadId);

    const { 
      father_name, mother_name, emergency_contact_name, emergency_contact_number, 
      ...appData 
    } = dto;

    await this.prisma.applications.update({
      where: { id: app.id },
      data: appData,
    });

    const familyData = { father_name, mother_name, emergency_contact_name, emergency_contact_number };
    const existingFamily = await this.prisma.application_family_details.findFirst({ where: { application_id: app.id } });

    if (existingFamily) {
      await this.prisma.application_family_details.update({
        where: { id: existingFamily.id },
        data: familyData,
      });
    } else {
      await this.prisma.application_family_details.create({
        data: { application_id: app.id, ...familyData },
      });
    }

    return this.getFullApplication(leadId, user);
  }

  // 2. Education
  async updateEducation(leadId: string, dto: UpdateEducationDto, user: any) {
    await this.validateLeadAccess(leadId, user); // <--- CHECK PERMISSION
    const app = await this.getOrCreateApplication(leadId);
    
    for (const record of dto.records) {
      if (record.id) {
        await this.prisma.application_education.update({
          where: { id: record.id },
          data: { ...record, id: undefined }, 
        });
      } else {
        await this.prisma.application_education.create({
          data: { ...record, application_id: app.id },
        });
      }
    }
    return this.getFullApplication(leadId, user);
  }

  // 3. Preferences
  async updatePreferences(leadId: string, dto: UpdatePreferencesDto, user: any) {
    await this.validateLeadAccess(leadId, user);
    const app = await this.getOrCreateApplication(leadId);
    const existing = await this.prisma.application_preferences.findFirst({ where: { application_id: app.id } });

    if (existing) {
      await this.prisma.application_preferences.update({ where: { id: existing.id }, data: dto });
    } else {
      await this.prisma.application_preferences.create({ data: { application_id: app.id, ...dto } });
    }
    return this.getFullApplication(leadId, user);
  }

  // 4. Tests
  async updateTests(leadId: string, dto: UpdateTestsDto, user: any) {
    await this.validateLeadAccess(leadId, user);
    const app = await this.getOrCreateApplication(leadId);
    for (const record of dto.records) {
      if (record.id) {
        await this.prisma.application_tests.update({
          where: { id: record.id },
          data: { ...record, id: undefined },
        });
      } else {
        await this.prisma.application_tests.create({
          data: { ...record, application_id: app.id },
        });
      }
    }
    return this.getFullApplication(leadId, user);
  }

  // 5. Work Experience
  async updateWorkExperience(leadId: string, dto: UpdateWorkExperienceDto, user: any) {
    await this.validateLeadAccess(leadId, user);
    const app = await this.getOrCreateApplication(leadId);
    for (const record of dto.records) {
      if (record.id) {
        await this.prisma.application_work_experience.update({
          where: { id: record.id },
          data: { ...record, id: undefined },
        });
      } else {
        await this.prisma.application_work_experience.create({
          data: { ...record, application_id: app.id },
        });
      }
    }
    return this.getFullApplication(leadId, user);
  }

  // 6. Visa Details
  async updateVisaDetails(leadId: string, dto: UpdateVisaDetailsDto, user: any) {
    await this.validateLeadAccess(leadId, user);
    const app = await this.getOrCreateApplication(leadId);
    const existing = await this.prisma.application_visa_details.findFirst({ where: { application_id: app.id } });

    if (existing) {
      await this.prisma.application_visa_details.update({ where: { id: existing.id }, data: dto });
    } else {
      await this.prisma.application_visa_details.create({ data: { application_id: app.id, ...dto } });
    }
    return this.getFullApplication(leadId, user);
  }

  // 7. Documents
  async updateDocuments(
    leadId: string,
    files: any,
    user: any // <--- Accept User
  ) {
    await this.validateLeadAccess(leadId, user);
    const app = await this.getOrCreateApplication(leadId);
    
    const existingDocs = await this.prisma.application_documents.findFirst({
      where: { application_id: app.id },
    });

    const updateData: any = {};

    const processSingleFile = async (fileArray: Express.Multer.File[] | undefined, fieldName: string) => {
      if (fileArray && fileArray.length > 0) {
        const url = await this.supabaseService.uploadFile(
          fileArray[0], 'idb-student-documents', `applications/${leadId}`
        );
        updateData[`${fieldName}_url`] = url;
      }
    };

    const processArrayFiles = async (
        fileArray: Express.Multer.File[] | undefined, 
        fieldName: string, existingUrls: string[] = []
    ) => {
      if (fileArray && fileArray.length > 0) {
        const newUrls = await Promise.all(
          fileArray.map((file) => 
            this.supabaseService.uploadFile(file, 'idb-student-documents', `applications/${leadId}`)
          )
        );
        updateData[`${fieldName}_url`] = [...existingUrls, ...newUrls];
      }
    };

    await processSingleFile(files.profile_photo, 'profile_photo');
    await processSingleFile(files.passport_copy, 'passport_copy');
    await processSingleFile(files.english_test_cert, 'english_test_cert');
    await processSingleFile(files.sop, 'sop');
    await processSingleFile(files.cv_resume, 'cv_resume');
    await processSingleFile(files.financial_documents, 'financial_documents');
    await processSingleFile(files.other_documents, 'other_documents');

    await processArrayFiles(files.academic_documents, 'academic_documents', existingDocs?.academic_documents_urls || []);
    await processArrayFiles(files.recommendation_letters, 'recommendation_letters', existingDocs?.recommendation_letters_url || []);

    if (existingDocs) {
      await this.prisma.application_documents.update({
        where: { id: existingDocs.id },
        data: updateData,
      });
    } else {
      await this.prisma.application_documents.create({
        data: { application_id: app.id, ...updateData },
      });
    }

    return this.getFullApplication(leadId, user);
  }

  async getFullApplication(leadId: string, user: any) {
    await this.validateLeadAccess(leadId, user); // <--- Security Check on GET too

    return this.prisma.applications.findFirst({
      where: { lead_id: leadId },
      include: {
        family_details: true,
        education: true,
        preferences: true,
        tests: true,
        work_experience: true,
        visa_details: true,
        documents: true,
      },
    });
  }
}