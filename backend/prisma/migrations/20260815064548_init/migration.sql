-- CreateEnum
CREATE TYPE "AgentStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "AgentRole" AS ENUM ('OWNER', 'MEMBER');

-- CreateEnum
CREATE TYPE "AgentContractStatus" AS ENUM ('PENDING', 'SIGNED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'APPROVED', 'CONVERTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('PENDING', 'APPROVED', 'PAID', 'REJECTED');

-- CreateEnum
CREATE TYPE "CommissionType" AS ENUM ('PERCENTAGE', 'FIXED');

-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('PARTNER', 'LEAD', 'AGENT');

-- CreateEnum
CREATE TYPE "academic_level_enum" AS ENUM ('Class Xth/SSC', 'Class XIIth/HSC', 'Graduation', 'Post Graduation');

-- CreateEnum
CREATE TYPE "category_enum" AS ENUM ('GENERAL', 'OBC', 'SC', 'ST', 'EWS');

-- CreateEnum
CREATE TYPE "gender_enum" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "marital_status_enum" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED');

-- CreateEnum
CREATE TYPE "marking_scheme_enum" AS ENUM ('PERCENTAGE', 'CGPA OUT OF 10', 'CGPA OUT OF 4');

-- CreateEnum
CREATE TYPE "result_status_enum" AS ENUM ('DECLARED', 'AWAITED');

-- CreateEnum
CREATE TYPE "timeline_event" AS ENUM ('LEAD_CREATED', 'LEAD_NAME_CHANGED', 'LEAD_PHONE_CHANGED', 'LEAD_EMAIL_CHANGED', 'LEAD_PURPOSE_CHANGED', 'LEAD_OWNER_CHANGED', 'LEAD_STATUS_CHANGED', 'LEAD_NOTE_ADDED', 'LEAD_NOTE_DELETED', 'LEAD_NOTE_UPDATED', 'LEAD_FOLLOWUP_ADDED', 'LEAD_FOLLOWUP_DELETED', 'LEAD_FOLLOWUP_UPDATED', 'LEAD_FOLLOWUP_DATE_EXTENDED', 'LEAD_FOLLOWUP_COMPLETED', 'LEAD_FOLLOWUP_COMMENT_ADDED', 'LEAD_FOLLOWUP_COMMENT_DELETED', 'LEAD_FOLLOWUP_COMMENT_UPDATED', 'OFFLINE_PAYMENT_ADDED', 'OFFLINE_PAYMENT_DELETED', 'ONLINE_PAYMENT_INITIATED', 'ONLINE_PAYMENT_VERIFIED', 'ONLINE_PAYMENT_FAILED', 'ONLINE_PAYMENT_CANCELED', 'LEAD_DEPARTMENT_CHANGED');

-- CreateEnum
CREATE TYPE "FinancialStatus" AS ENUM ('PENDING', 'SENT_TO_UNIVERSITY', 'UNDER_PROCESS', 'APPROVED', 'DECLINED');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'AWAITING_REPLY', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "TicketRequesterType" AS ENUM ('PARTNER', 'AGENT', 'AGENT_TEAM_MEMBER');

-- CreateEnum
CREATE TYPE "IntegrationProvider" AS ENUM ('RAZORPAY', 'KHALTI', 'GOOGLE_ADS', 'META_PIXEL', 'MAILSUITE', 'SENDER', 'BREVO');

-- CreateEnum
CREATE TYPE "PaymentGateway" AS ENUM ('RAZORPAY', 'KHALTI');

-- CreateEnum
CREATE TYPE "PaymentTxStatus" AS ENUM ('INITIATED', 'PENDING', 'COMPLETED', 'FAILED', 'CANCELED', 'EXPIRED', 'REFUNDED');

-- CreateTable
CREATE TABLE "branches" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "parent_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_departments" (
    "partner_id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partner_departments_pkey" PRIMARY KEY ("partner_id","department_id")
);

-- CreateTable
CREATE TABLE "department_order" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "department_id" UUID NOT NULL,
    "order_index" INTEGER NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "department_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department_statuses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "department_id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "is_terminal" BOOLEAN NOT NULL DEFAULT false,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "department_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department_assignment_cursors" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "branch_id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "last_partner_id" UUID,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "department_assignment_cursors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcement_reads" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "announcement_id" UUID,
    "partner_id" UUID,
    "read_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "announcement_reads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "target_audience" TEXT NOT NULL,
    "audience" TEXT DEFAULT 'all',
    "users" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "branch_id" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN DEFAULT true,
    "branches" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "roles" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_documents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "application_id" UUID NOT NULL,
    "profile_photo_url" TEXT,
    "passport_copy_url" TEXT,
    "academic_documents_urls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "english_test_cert_url" TEXT,
    "sop_url" TEXT,
    "cv_resume_url" TEXT,
    "recommendation_letters_url" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "financial_documents_url" TEXT,
    "other_documents_url" TEXT,

    CONSTRAINT "application_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_family_details" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "application_id" UUID NOT NULL,
    "father_name" TEXT,
    "mother_name" TEXT,
    "emergency_contact_name" TEXT,
    "emergency_contact_number" TEXT,

    CONSTRAINT "application_family_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_preferences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "application_id" UUID NOT NULL,
    "preferred_country" TEXT,
    "preferred_course_type" TEXT,
    "preferred_course_name" TEXT,
    "preferred_intake" TEXT,
    "preferred_university" TEXT,
    "backup_country" TEXT,
    "study_mode" TEXT,
    "budget_range" TEXT,
    "scholarship_interest" BOOLEAN,
    "travel_history" TEXT,
    "course_id" TEXT,

    CONSTRAINT "application_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lead_id" UUID NOT NULL,
    "student_id" TEXT,
    "given_name" TEXT,
    "surname" TEXT,
    "dob" DATE,
    "gender" TEXT,
    "marital_status" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "alternate_phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "citizenship" TEXT,
    "national_id" TEXT,
    "current_status" TEXT,
    "gap_years" INTEGER,
    "referral_source" TEXT,
    "application_stage" TEXT,
    "system_remarks" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_financials" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "application_id" UUID NOT NULL,
    "status" "FinancialStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_financials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_notes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "financial_id" UUID NOT NULL,
    "stage" "FinancialStatus" NOT NULL,
    "content" TEXT NOT NULL,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financial_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_education" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "application_id" UUID NOT NULL,
    "level" TEXT,
    "institution_name" TEXT,
    "board_university" TEXT,
    "country_of_study" TEXT,
    "major_stream" TEXT,
    "percentage_gpa" TEXT,
    "year_of_passing" TEXT,
    "medium_of_instruction" TEXT,
    "backlogs" INTEGER,
    "certificate_url" TEXT,

    CONSTRAINT "application_education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_tests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "application_id" UUID NOT NULL,
    "test_type" TEXT,
    "test_date" DATE,
    "overall_score" DECIMAL(4,1),
    "listening" DECIMAL(4,1),
    "reading" DECIMAL(4,1),
    "writing" DECIMAL(4,1),
    "speaking" DECIMAL(4,1),
    "trf_number" TEXT,

    CONSTRAINT "application_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_work_experience" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "application_id" UUID NOT NULL,
    "company_name" TEXT,
    "designation" TEXT,
    "start_date" DATE,
    "end_date" DATE,
    "job_duties" TEXT,
    "certificate_url" TEXT,

    CONSTRAINT "application_work_experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_visa_details" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "application_id" UUID NOT NULL,
    "passport_number" TEXT,
    "passport_issue_date" DATE,
    "passport_expiry_date" DATE,
    "passport_place_of_issue" TEXT,
    "passport_nationality" TEXT,
    "country_applied_for" TEXT,
    "previous_visa_type" TEXT,
    "visa_status" TEXT,
    "visa_refusal_reason" TEXT,
    "travelled_countries" TEXT,
    "is_visa_rejected_past" BOOLEAN,

    CONSTRAINT "application_visa_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "followup_comments" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT,
    "followup_id" UUID,
    "created_by" UUID,

    CONSTRAINT "followup_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "followups" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "title" TEXT,
    "lead_id" UUID,
    "completed" BOOLEAN,
    "created_by" UUID,
    "due_date" TIMESTAMPTZ(6),

    CONSTRAINT "followups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "preferred_country" TEXT NOT NULL,
    "preferred_course" TEXT,
    "status" TEXT NOT NULL,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "assigned_to" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "reason" TEXT,
    "password" TEXT DEFAULT '',
    "is_flagged" BOOLEAN NOT NULL DEFAULT false,
    "branch_id" UUID,
    "agent_id" UUID,
    "assigned_agent_id" UUID,
    "agent_team_member_id" UUID,
    "exam_score" TEXT,
    "exam_taken" TEXT,
    "current_department_id" UUID,
    "past_departments" JSONB NOT NULL DEFAULT '[]',
    "past_owners" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "text" TEXT,
    "lead_id" UUID,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offline_payments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "payment_mode" TEXT,
    "currency" TEXT NOT NULL,
    "amount" BIGINT,
    "payment_type" TEXT NOT NULL,
    "reference_id" TEXT,
    "receiver" UUID,
    "lead_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT,
    "file" TEXT,
    "created_by" UUID,
    "due_date" TIMESTAMPTZ(6),

    CONSTRAINT "offline_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "role_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "remarks" TEXT,
    "agency_name" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "branch_id" UUID,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "agency_name" TEXT NOT NULL,
    "website" TEXT,
    "region" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "postal_code" TEXT,
    "business_reg_no" TEXT,
    "established_year" INTEGER,
    "status" "AgentStatus" NOT NULL DEFAULT 'PENDING',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "rejection_reason" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "branch_id" UUID,
    "agent_role" "AgentRole" DEFAULT 'OWNER',
    "parent_id" UUID,
    "contract_approved" BOOLEAN NOT NULL DEFAULT false,
    "category_id" UUID,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordReset" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userType" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "label" TEXT,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_university_access" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "category_id" UUID NOT NULL,
    "university_id" TEXT NOT NULL,
    "commission_percent" DECIMAL(5,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_university_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_documents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "agent_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "uploaded_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "agent_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_university_access" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "agent_id" UUID NOT NULL,
    "university_id" TEXT NOT NULL,
    "granted_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_university_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_contracts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "agent_id" UUID,
    "signature_url" TEXT,
    "signed_at" TIMESTAMPTZ(6),
    "approved_at" TIMESTAMPTZ(6),
    "approved_by" UUID,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_signed" BOOLEAN NOT NULL DEFAULT false,
    "rejection_note" TEXT,
    "status" "AgentContractStatus" NOT NULL DEFAULT 'PENDING',
    "title" TEXT NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_team_members" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "agent_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_inquiries" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "company_name" TEXT,
    "website" TEXT,
    "country" TEXT,
    "city" TEXT,
    "experience_years" INTEGER,
    "student_volume" TEXT,
    "message" TEXT,
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "company_address" TEXT,
    "contact_person" TEXT,
    "contact_designation" TEXT,
    "contact_department" TEXT,
    "source_country" TEXT,
    "operation_countries" TEXT,
    "phone" TEXT,
    "accreditation_details" TEXT,
    "associations" TEXT,
    "moe_approvals" TEXT,

    CONSTRAINT "agent_inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_inquiry_documents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "inquiry_id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "uploaded_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_inquiry_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lead_id" UUID NOT NULL,
    "event_type" "timeline_event" NOT NULL,
    "old_state" TEXT,
    "new_state" TEXT,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT,
    "actor_name" TEXT,

    CONSTRAINT "timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commissions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lead_id" UUID,
    "application_id" UUID,
    "agent_id" UUID,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "CommissionStatus" NOT NULL DEFAULT 'PENDING',
    "remarks" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission_group" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "permission_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "permission_group_id" UUID,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department_permissions" (
    "department_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "department_permissions_pkey" PRIMARY KEY ("department_id","permission_id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permission" (
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,

    CONSTRAINT "role_permission_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "flag" TEXT,
    "region" TEXT,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "universities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "city" TEXT,
    "country_id" TEXT NOT NULL,
    "commission_type" "CommissionType" DEFAULT 'PERCENTAGE',
    "commission_value" DECIMAL(10,2),
    "currency" TEXT DEFAULT 'INR',
    "excluded_countries" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "allowed_countries" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "universities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "level" TEXT,
    "category" TEXT,
    "duration" INTEGER,
    "fee_type" TEXT,
    "original_fee" DECIMAL(10,2),
    "fee_currency" TEXT DEFAULT 'PLN',
    "fee" DECIMAL(10,2),
    "course_currency" TEXT DEFAULT 'PLN',
    "application_fee" DECIMAL(10,2),
    "application_currency" TEXT DEFAULT 'PLN',
    "intake_month" TEXT,
    "commission_type" TEXT DEFAULT '%',
    "commission_value" DECIMAL(10,2),
    "details" JSONB,
    "university_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "excluded_countries" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "todos" (
    "title" TEXT NOT NULL,
    "created_by" UUID NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "dueDate" TIMESTAMP(3),
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "todos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "option_lists" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "option_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lead_id" UUID NOT NULL,
    "partner_id" UUID,
    "agent_id" UUID,
    "sender_type" "SenderType" NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dropdown_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "label" TEXT,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dropdown_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dropdown_options" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "category_id" UUID NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dropdown_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_tickets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "case_number" SERIAL NOT NULL,
    "partner_id" UUID,
    "topic" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "institution_id" TEXT,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "TicketPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "attachment_urls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requester_agent_id" UUID,
    "requester_parent_agent_id" UUID,
    "requester_partner_id" UUID,
    "requester_team_member_id" UUID,
    "requester_type" "TicketRequesterType",

    CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_ticket_comments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ticket_id" UUID NOT NULL,
    "sender_id" UUID NOT NULL,
    "sender_type" TEXT NOT NULL,
    "sender_name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "attachment_urls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_ticket_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_templates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" TEXT,
    "variables" TEXT[],
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_configs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "provider" "IntegrationProvider" NOT NULL,
    "display_name" TEXT NOT NULL,
    "api_key" TEXT,
    "api_secret" TEXT,
    "config_json" JSONB DEFAULT '{}',
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "connected_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "integration_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_transactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lead_id" UUID NOT NULL,
    "gateway" "PaymentGateway" NOT NULL,
    "status" "PaymentTxStatus" NOT NULL DEFAULT 'INITIATED',
    "amount" BIGINT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "order_ref" TEXT,
    "gateway_payment_id" TEXT,
    "gateway_transaction_id" TEXT,
    "pidx" TEXT,
    "callback_payload" JSONB,
    "verify_payload" JSONB,
    "meta" JSONB DEFAULT '{}',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LeadCourses" (
    "A" TEXT NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_LeadCourses_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "branches_code_key" ON "branches"("code");

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "departments_code_key" ON "departments"("code");

-- CreateIndex
CREATE INDEX "idx_partner_departments_department_active" ON "partner_departments"("department_id", "is_active");

-- CreateIndex
CREATE INDEX "idx_partner_departments_partner_active" ON "partner_departments"("partner_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "department_order_department_id_key" ON "department_order"("department_id");

-- CreateIndex
CREATE UNIQUE INDEX "department_order_order_index_key" ON "department_order"("order_index");

-- CreateIndex
CREATE INDEX "idx_department_order_active_order" ON "department_order"("is_active", "order_index");

-- CreateIndex
CREATE INDEX "idx_department_status_department_active" ON "department_statuses"("department_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "department_statuses_department_id_key_key" ON "department_statuses"("department_id", "key");

-- CreateIndex
CREATE UNIQUE INDEX "department_statuses_department_id_order_index_key" ON "department_statuses"("department_id", "order_index");

-- CreateIndex
CREATE INDEX "idx_department_assignment_cursor_last_partner" ON "department_assignment_cursors"("last_partner_id");

-- CreateIndex
CREATE UNIQUE INDEX "department_assignment_cursors_branch_id_department_id_key" ON "department_assignment_cursors"("branch_id", "department_id");

-- CreateIndex
CREATE UNIQUE INDEX "announcement_reads_announcement_id_partner_id_key" ON "announcement_reads"("announcement_id", "partner_id");

-- CreateIndex
CREATE UNIQUE INDEX "applications_student_id_key" ON "applications"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "application_financials_application_id_key" ON "application_financials"("application_id");

-- CreateIndex
CREATE UNIQUE INDEX "leads_email_key" ON "leads"("email");

-- CreateIndex
CREATE UNIQUE INDEX "leads_mobile_key" ON "leads"("mobile");

-- CreateIndex
CREATE INDEX "idx_leads_branch_department" ON "leads"("branch_id", "current_department_id");

-- CreateIndex
CREATE INDEX "idx_leads_department" ON "leads"("current_department_id");

-- CreateIndex
CREATE UNIQUE INDEX "partners_email_key" ON "partners"("email");

-- CreateIndex
CREATE UNIQUE INDEX "partners_mobile_key" ON "partners"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "agents_email_key" ON "agents"("email");

-- CreateIndex
CREATE UNIQUE INDEX "agents_mobile_key" ON "agents"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_email_key" ON "PasswordReset"("email");

-- CreateIndex
CREATE UNIQUE INDEX "agent_categories_name_key" ON "agent_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "category_university_access_category_id_university_id_key" ON "category_university_access"("category_id", "university_id");

-- CreateIndex
CREATE UNIQUE INDEX "agent_university_access_agent_id_university_id_key" ON "agent_university_access"("agent_id", "university_id");

-- CreateIndex
CREATE UNIQUE INDEX "agent_team_members_email_key" ON "agent_team_members"("email");

-- CreateIndex
CREATE UNIQUE INDEX "agent_team_members_mobile_key" ON "agent_team_members"("mobile");

-- CreateIndex
CREATE INDEX "idx_timeline_created_at" ON "timeline"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_timeline_created_by" ON "timeline"("created_by");

-- CreateIndex
CREATE INDEX "idx_timeline_event_type" ON "timeline"("event_type");

-- CreateIndex
CREATE INDEX "idx_timeline_lead_id" ON "timeline"("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "permission_group_name_key" ON "permission_group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permission_name_key" ON "permission"("name");

-- CreateIndex
CREATE INDEX "idx_department_permission_department_active" ON "department_permissions"("department_id", "is_active");

-- CreateIndex
CREATE INDEX "idx_department_permission_permission_active" ON "department_permissions"("permission_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "countries_name_key" ON "countries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "option_lists_key_key" ON "option_lists"("key");

-- CreateIndex
CREATE INDEX "chat_messages_lead_id_idx" ON "chat_messages"("lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "dropdown_categories_name_key" ON "dropdown_categories"("name");

-- CreateIndex
CREATE INDEX "idx_support_tickets_req_partner" ON "support_tickets"("requester_type", "requester_partner_id");

-- CreateIndex
CREATE INDEX "idx_support_tickets_req_agent" ON "support_tickets"("requester_type", "requester_agent_id");

-- CreateIndex
CREATE INDEX "idx_support_tickets_req_team_member" ON "support_tickets"("requester_type", "requester_team_member_id");

-- CreateIndex
CREATE INDEX "idx_support_tickets_req_parent_agent" ON "support_tickets"("requester_parent_agent_id");

-- CreateIndex
CREATE INDEX "idx_support_tickets_status_created" ON "support_tickets"("status", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "email_templates_name_key" ON "email_templates"("name");

-- CreateIndex
CREATE UNIQUE INDEX "integration_configs_provider_key" ON "integration_configs"("provider");

-- CreateIndex
CREATE INDEX "idx_payment_tx_lead" ON "payment_transactions"("lead_id");

-- CreateIndex
CREATE INDEX "idx_payment_tx_gateway_status" ON "payment_transactions"("gateway", "status");

-- CreateIndex
CREATE INDEX "_LeadCourses_B_index" ON "_LeadCourses"("B");

-- AddForeignKey
ALTER TABLE "branches" ADD CONSTRAINT "branches_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_departments" ADD CONSTRAINT "partner_departments_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_departments" ADD CONSTRAINT "partner_departments_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_order" ADD CONSTRAINT "department_order_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_statuses" ADD CONSTRAINT "department_statuses_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_assignment_cursors" ADD CONSTRAINT "department_assignment_cursors_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_assignment_cursors" ADD CONSTRAINT "department_assignment_cursors_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_assignment_cursors" ADD CONSTRAINT "department_assignment_cursors_last_partner_id_fkey" FOREIGN KEY ("last_partner_id") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement_reads" ADD CONSTRAINT "announcement_reads_announcement_id_fkey" FOREIGN KEY ("announcement_id") REFERENCES "announcements"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "announcement_reads" ADD CONSTRAINT "announcement_reads_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "partners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_documents" ADD CONSTRAINT "application_documents_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_family_details" ADD CONSTRAINT "application_family_details_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_preferences" ADD CONSTRAINT "application_preferences_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_preferences" ADD CONSTRAINT "application_preferences_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "application_financials" ADD CONSTRAINT "application_financials_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_notes" ADD CONSTRAINT "financial_notes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_notes" ADD CONSTRAINT "financial_notes_financial_id_fkey" FOREIGN KEY ("financial_id") REFERENCES "application_financials"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_education" ADD CONSTRAINT "application_education_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_tests" ADD CONSTRAINT "application_tests_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_work_experience" ADD CONSTRAINT "application_work_experience_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_visa_details" ADD CONSTRAINT "application_visa_details_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followup_comments" ADD CONSTRAINT "followup_comments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "partners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "followup_comments" ADD CONSTRAINT "followup_comments_followup_id_fkey" FOREIGN KEY ("followup_id") REFERENCES "followups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "followups" ADD CONSTRAINT "followups_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "partners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "followups" ADD CONSTRAINT "followups_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_agent_team_member_id_fkey" FOREIGN KEY ("agent_team_member_id") REFERENCES "agent_team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_agent_id_fkey" FOREIGN KEY ("assigned_agent_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "partners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "partners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_current_department_id_fkey" FOREIGN KEY ("current_department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "partners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "offline_payments" ADD CONSTRAINT "offline_payments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "partners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "offline_payments" ADD CONSTRAINT "offline_payments_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "offline_payments" ADD CONSTRAINT "offline_payments_receiver_fkey" FOREIGN KEY ("receiver") REFERENCES "partners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agents" ADD CONSTRAINT "agents_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "agent_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_university_access" ADD CONSTRAINT "category_university_access_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "agent_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_university_access" ADD CONSTRAINT "category_university_access_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_documents" ADD CONSTRAINT "agent_documents_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_university_access" ADD CONSTRAINT "agent_university_access_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_university_access" ADD CONSTRAINT "agent_university_access_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_contracts" ADD CONSTRAINT "agent_contracts_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_team_members" ADD CONSTRAINT "agent_team_members_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_inquiry_documents" ADD CONSTRAINT "agent_inquiry_documents_inquiry_id_fkey" FOREIGN KEY ("inquiry_id") REFERENCES "agent_inquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline" ADD CONSTRAINT "timeline_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "timeline" ADD CONSTRAINT "timeline_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_permission_group_id_fkey" FOREIGN KEY ("permission_group_id") REFERENCES "permission_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "department_permissions" ADD CONSTRAINT "department_permissions_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_permissions" ADD CONSTRAINT "department_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "universities" ADD CONSTRAINT "universities_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "partners"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dropdown_options" ADD CONSTRAINT "dropdown_options_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "dropdown_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_partner_id_fkey" FOREIGN KEY ("partner_id") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_requester_agent_id_fkey" FOREIGN KEY ("requester_agent_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_requester_parent_agent_id_fkey" FOREIGN KEY ("requester_parent_agent_id") REFERENCES "agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_requester_partner_id_fkey" FOREIGN KEY ("requester_partner_id") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_requester_team_member_id_fkey" FOREIGN KEY ("requester_team_member_id") REFERENCES "agent_team_members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_ticket_comments" ADD CONSTRAINT "support_ticket_comments_ticket_id_fkey" FOREIGN KEY ("ticket_id") REFERENCES "support_tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeadCourses" ADD CONSTRAINT "_LeadCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeadCourses" ADD CONSTRAINT "_LeadCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
