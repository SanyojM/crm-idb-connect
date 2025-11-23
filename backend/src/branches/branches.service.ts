import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  async create(createBranchDto: CreateBranchDto) {
    // Check for duplicate Code
    const existing = await this.prisma.branch.findUnique({
      where: { code: createBranchDto.code },
    });
    if (existing) throw new ConflictException('Branch code already exists');

    // Verify Parent ID if provided
    if (createBranchDto.parent_id) {
      const parent = await this.prisma.branch.findUnique({
        where: { id: createBranchDto.parent_id },
      });
      if (!parent) throw new NotFoundException('Parent branch not found');
    }

    return this.prisma.branch.create({
      data: createBranchDto,
    });
  }

  async findAll() {
    // Return list with parent info (useful for tables)
    return this.prisma.branch.findMany({
      include: {
        parent: { select: { name: true, type: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const branch = await this.prisma.branch.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true, // <--- Shows immediate sub-branches
        partners: { select: { name: true, role: true } }, // Who works here?
      },
    });
    if (!branch) throw new NotFoundException(`Branch ${id} not found`);
    return branch;
  }

  async update(id: string, updateBranchDto: UpdateBranchDto) {
    await this.findOne(id); // Ensure exists
    return this.prisma.branch.update({
      where: { id },
      data: updateBranchDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure exists
    // Prisma will throw error if it has children (Foreign Key constraint)
    // which is good behavior (don't delete parents of active branches)
    return this.prisma.branch.delete({
      where: { id },
    });
  }
}