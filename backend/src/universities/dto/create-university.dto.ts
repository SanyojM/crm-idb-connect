export class CreateUniversityDto {
  name: string;
  country_id: string; // Link to Country
  city?: string;
  logo?: string;
}