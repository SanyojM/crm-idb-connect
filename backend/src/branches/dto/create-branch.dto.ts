import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  name: string;

  @IsString()
  code: string; // e.g. "DEL-001"

  @IsString()
  @IsEnum(['HeadOffice', 'Regional', 'Branch']) // Enforce types
  type: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsUUID()
  parent_id?: string; // The UUID of the parent branch (e.g. Head Office ID)
}