import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateAnnouncementDto, userId: string) {
    return this.prisma.announcements.create({
      data: {
        ...createDto,
        created_by: userId,
      },
      include: {
        partners: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(userId?: string, includeInactive = false) {
    const where: any = {};
    
    if (!includeInactive) {
      where.is_active = true;
    }

    // Filter by target audience
    if (userId) {
      where.OR = [
        { target_audience: 'user', users: { has: userId } },
        { target_audience: 'branch' },
      ];
    }

    return this.prisma.announcements.findMany({
      where,
      include: {
        partners: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        announcement_reads: {
          where: userId ? { partner_id: userId } : undefined,
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const announcement = await this.prisma.announcements.findUnique({
      where: { id },
      include: {
        partners: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        announcement_reads: {
          include: {
            partners: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!announcement) {
      throw new NotFoundException(`Announcement with ID ${id} not found`);
    }

    return announcement;
  }

  async update(id: string, updateDto: UpdateAnnouncementDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.announcements.update({
      where: { id },
      data: updateDto,
      include: {
        partners: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if exists

    await this.prisma.announcements.delete({
      where: { id },
    });

    return { message: 'Announcement deleted successfully' };
  }

  async markAsRead(announcementId: string, userId: string) {
    // Check if announcement exists
    await this.findOne(announcementId);

    // Create or update read record
    return this.prisma.announcement_reads.upsert({
      where: {
        announcement_id_partner_id: {
          announcement_id: announcementId,
          partner_id: userId,
        },
      },
      create: {
        announcement_id: announcementId,
        partner_id: userId,
      },
      update: {
        read_at: new Date(),
      },
    });
  }

  async getUnreadCount(userId: string) {
    const announcements = await this.findAll(userId, false);
    const unreadCount = announcements.filter(
      (a) => a.announcement_reads.length === 0
    ).length;

    return { unreadCount };
  }
}
