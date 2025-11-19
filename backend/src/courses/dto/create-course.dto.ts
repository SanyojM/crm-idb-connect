export class CreateCourseDto {
  // Course Fields
  name: string;
  description?: string;
  level: string;
  category: string;
  duration: number;
  fee_type?: string;
  original_fee?: number;
  fee: number;
  application_fee?: number;
  intake_month?: string;
  commission?: string;

  // Relations
  university_id: string;
}