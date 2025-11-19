import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@Injectable()
export class CountriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCountryDto: CreateCountryDto) {
    try {
      return await this.prisma.country.create({
        data: createCountryDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Country with this name already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.country.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { universities: true } } // Optional: shows count of unis
      }
    });
  }

  async findOne(id: string) {
    const country = await this.prisma.country.findUnique({
      where: { id },
      include: { universities: true }, // Return list of unis in this country
    });
    if (!country) throw new NotFoundException(`Country ${id} not found`);
    return country;
  }

  async update(id: string, updateCountryDto: UpdateCountryDto) {
    try {
      return await this.prisma.country.update({
        where: { id },
        data: updateCountryDto,
      });
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException(`Country ${id} not found`);
      if (error.code === 'P2002') throw new ConflictException('Country name already exists');
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.country.delete({ where: { id } });
      return { message: `Country ${id} deleted successfully` };
    } catch (error) {
      if (error.code === 'P2025') throw new NotFoundException(`Country ${id} not found`);
      throw error;
    }
  }
}