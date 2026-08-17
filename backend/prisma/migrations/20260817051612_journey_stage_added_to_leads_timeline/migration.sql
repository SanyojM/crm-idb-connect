-- CreateEnum
CREATE TYPE "StageStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'DONE', 'REJECTED', 'SUPPLEMENT_REQUESTED', 'SKIPPED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "timeline_event" ADD VALUE 'ONLINE_INQUIRY';
ALTER TYPE "timeline_event" ADD VALUE 'OFFICE_VISIT';
ALTER TYPE "timeline_event" ADD VALUE 'ACADEMIC_DOCS_SUBMITTED';
ALTER TYPE "timeline_event" ADD VALUE 'APPLICATION_PROCESSED';
ALTER TYPE "timeline_event" ADD VALUE 'APPLICATION_SUBMITTED_TO_UNIVERSITY';
ALTER TYPE "timeline_event" ADD VALUE 'UNIVERSITY_ACCEPTANCE_RECEIVED';
ALTER TYPE "timeline_event" ADD VALUE 'PAYMENT_DONE';
ALTER TYPE "timeline_event" ADD VALUE 'VISA_DOCS_PREPARED';
ALTER TYPE "timeline_event" ADD VALUE 'FORWARDED_TO_COMPLIANCE';
ALTER TYPE "timeline_event" ADD VALUE 'VISA_DECISION';
ALTER TYPE "timeline_event" ADD VALUE 'REFUND_PROCESSED';
ALTER TYPE "timeline_event" ADD VALUE 'POST_COUNSELLING_DONE';
