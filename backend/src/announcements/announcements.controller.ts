import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';

@Controller('announcements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Post()
  @Roles(Role.Admin) // Only admins can create announcements
  create(@Body() createDto: CreateAnnouncementDto, @Request() req) {
    return this.announcementsService.create(createDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req, @Query('includeInactive') includeInactive?: string) {
    const includeInactiveBool = includeInactive === 'true';
    return this.announcementsService.findAll(
      req.user.userId,
      includeInactiveBool
    );
  }

  @Get('unread-count')
  getUnreadCount(@Request() req) {
    return this.announcementsService.getUnreadCount(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.announcementsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  update(@Param('id') id: string, @Body() updateDto: UpdateAnnouncementDto) {
    return this.announcementsService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.announcementsService.remove(id);
  }

  @Post(':id/mark-read')
  markAsRead(@Param('id') id: string, @Request() req) {
    return this.announcementsService.markAsRead(id, req.user.userId);
  }
}
