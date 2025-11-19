export class CourseFilterDto {
  search?: string;
  country?: string[];    // Array of country names
  level?: string[];      // Array of levels (Masters, Bachelors)
  university?: string[]; // Array of university names
  intake?: string[];     // Array of months
}