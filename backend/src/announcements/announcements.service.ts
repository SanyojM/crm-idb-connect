// src/announcements/announcements.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

// Cast to any to allow `audience` field until prisma generate runs post-deploy
const announcementsModel = (prisma: PrismaService) => (prisma.announcements as any);

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  // 1. Create
  async create(createDto: CreateAnnouncementDto, userId: string) {
    const { title, content, target_audience, audience, users, branch_id, is_active } = createDto;

    return announcementsModel(this.prisma).create({
      data: {
        title,
        content,
        target_audience,
        audience: audience ?? 'all',
        users: users ?? [],
        branch_id: branch_id,
        is_active: is_active ?? true,
        created_by: userId,
      },
      include: {
        partners: { select: { id: true, name: true, email: true } },
      },
    });
  }

  // 2. FindAll
  // audienceFilter: when provided (e.g. "b2b"), returns rows where audience IN [audienceFilter, "all"]
  // when not provided, applies normal CRM branch scoping
  async findAll(user: any, includeInactive = false, audienceFilter?: string) {
    const where: any = {};

    // A. Active filter
    if (!includeInactive) {
      where.is_active = true;
    }

    if (audienceFilter) {
      // B1. Audience-based filter (for B2B portal) — bypass CRM scoping
      where.AND = [
        {
          OR: [
            { audience: audienceFilter },
            { audience: 'all' },
          ],
        },
      ];
    } else {
      // B2. CRM Scoping Logic
      if (user.role === 'admin') {
        // Admins see EVERYTHING
      } else {
        where.OR = [
          { target_audience: 'branch' },
          { target_audience: 'branch-specific', branches: { has: user.branch_id } },
          { target_audience: 'role-based', roles: { has: user.role?.toLowerCase() } },
          { target_audience: 'user', users: { has: user.id } },
        ];
        // CRM users see internal + all (not b2b-only)
        where.AND = [
          {
            OR: [
              { audience: 'internal' },
              { audience: 'all' },
              { audience: null },
            ],
          },
        ];
      }
    }

    return announcementsModel(this.prisma).findMany({
      where,
      include: {
        partners: { select: { id: true, name: true, email: true } },
        announcement_reads: {
          where: { partner_id: user.id },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const announcement = await announcementsModel(this.prisma).findUnique({
      where: { id },
      include: {
        partners: { select: { id: true, name: true, email: true } },
        announcement_reads: {
          include: {
            partners: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!announcement) throw new NotFoundException(`Announcement ${id} not found`);
    return announcement;
  }

  async update(id: string, updateDto: UpdateAnnouncementDto) {
    await this.findOne(id);
    return announcementsModel(this.prisma).update({
      where: { id },
      data: updateDto,
      include: { partners: { select: { id: true, name: true, email: true } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.announcements.delete({ where: { id } });
    return { message: 'Announcement deleted successfully' };
  }

  async markAsRead(announcementId: string, userId: string) {
    await this.findOne(announcementId);
    return this.prisma.announcement_reads.upsert({
      where: {
        announcement_id_partner_id: {
          announcement_id: announcementId,
          partner_id: userId,
        },
      },
      create: { announcement_id: announcementId, partner_id: userId },
      update: { read_at: new Date() },
    });
  }

  async markAllAsRead(user: any) {
    const announcements = await this.findAll(user, false);
    const unread = announcements.filter((a: any) => a.announcement_reads.length === 0);

    const promises = unread.map((a: any) =>
      this.prisma.announcement_reads.upsert({
        where: {
          announcement_id_partner_id: {
            announcement_id: a.id,
            partner_id: user.id,
          },
        },
        create: { announcement_id: a.id, partner_id: user.id },
        update: { read_at: new Date() },
      })
    );

    await Promise.all(promises);
    return { success: true, count: unread.length };
  }

  async getUnreadCount(user: any) {
    const announcements = await this.findAll(user, false);
    const unreadCount = announcements.filter(
      (a: any) => a.announcement_reads.length === 0
    ).length;
    return { count: unreadCount };
  }
}