import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';

@Injectable()
export class UniversitiesService {
  constructor(private prisma: PrismaService) {}

  async create(createUniversityDto: CreateUniversityDto) {
    const { country_id, ...data } = createUniversityDto;
    
    // Verify country exists
    const country = await this.prisma.country.findUnique({ where: { id: country_id } });
    if (!country) throw new NotFoundException(`Country ${country_id} not found`);

    return this.prisma.university.create({
      data: {
        ...data,
        countryId: country_id, // Map camelCase to prisma schema name
      },
    });
  }

  async findAll(countryId?: string) {
    return this.prisma.university.findMany({
      where: countryId ? { countryId } : undefined,
      include: { country: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const university = await this.prisma.university.findUnique({
      where: { id },
      include: { country: true, courses: true }, // Include courses
    });
    if (!university) throw new NotFoundException(`University ${id} not found`);
    return university;
  }

  async update(id: string, updateUniversityDto: UpdateUniversityDto) {
    try {
        const { country_id, ...data } = updateUniversityDto;
        return await this.prisma.university.update({
            where: { id },
            data: {
                ...data,
                ...(country_id && { countryId: country_id }) // Only update if provided
            },
        });
    } catch (error) {
        if (error.code === 'P2025') throw new NotFoundException(`University ${id} not found`);
        throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.university.delete({ where: { id } });
      return { message: `University ${id} deleted successfully` };
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException(`University ${id} not found`);
      throw error;
    }
  }
}