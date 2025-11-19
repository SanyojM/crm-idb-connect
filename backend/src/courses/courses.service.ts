// src/courses/courses.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CourseFilterDto } from './dto/course-filter.dto';
import { Prisma } from '../../generated/prisma/client';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto) {
    const { university_id, ...data } = createCourseDto;
    
    // Verify university exists
    const university = await this.prisma.university.findUnique({
      where: { id: university_id },
    });
    if (!university) throw new NotFoundException('University not found');

    return this.prisma.course.create({
      data: {
        ...data,
        universityId: university_id,
      },
    });
  }

  async findAll(filters: CourseFilterDto) {
    const { search, country, level, university, intake } = filters;

    // Build dynamic where clause
    const where: Prisma.CourseWhereInput = {};

    // 1. Search (Course Name or University Name)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { university: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // 2. Filter by Level (e.g., ["Masters", "PhD"])
    if (level && level.length > 0) {
      where.level = { in: level };
    }

    // --- FIX: Handle University & Country Relation Filters Separately ---
    
    const universityWhere: Prisma.UniversityWhereInput = {};
    let hasUniversityFilter = false;

    // 3. Filter by University Name
    if (university && university.length > 0) {
      universityWhere.name = { in: university };
      hasUniversityFilter = true;
    }

    // 4. Filter by Country (requires querying the relation)
    if (country && country.length > 0) {
      universityWhere.country = { name: { in: country } };
      hasUniversityFilter = true;
    }

    // Assign the university filter if any condition was added
    if (hasUniversityFilter) {
      where.university = universityWhere;
    }

    // ------------------------------------------------------------------

    // 5. Filter by Intake (Partial match, e.g. "Sep" in "Sep, Jan")
    if (intake && intake.length > 0) {
      where.OR = intake.map((month) => ({
        intakeMonth: { contains: month, mode: 'insensitive' },
      }));
    }

    return this.prisma.course.findMany({
      where,
      include: {
        university: {
          include: {
            country: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        university: {
          include: { country: true },
        },
      },
    });
    if (!course) throw new NotFoundException(`Course ${id} not found`);
    return course;
  }
  
  // Helper to get filter options (for your sidebar)
  async getFilterOptions() {
    const [countries, universities, levels] = await Promise.all([
      this.prisma.country.findMany({ select: { name: true } }),
      this.prisma.university.findMany({ select: { name: true } }),
      this.prisma.course.groupBy({ by: ['level'], _count: true }),
    ]);

    return {
      countries: countries.map(c => c.name),
      universities: universities.map(u => u.name),
      levels: levels.map(l => l.level).filter(Boolean),
    };
  }
}