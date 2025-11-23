// src/universities/dto/create-university.dto.ts
import { IsString, IsOptional, IsUUID } from 'class-validator'; // Best practice to add validation

export class CreateUniversityDto {
  @IsString()
  name: string;

  @IsUUID()
  countryId: string; // ✅ Changed from country_id to countryId

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  logo?: string;
}