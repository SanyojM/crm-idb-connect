// src/notes/notes.controller.ts
import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { GetUser } from '../auth/get-user.decorator';

@Controller()
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('notes')
  create(@Body() createNoteDto: CreateNoteDto, @GetUser() user: any) {
    // Pass full user object for scoping
    return this.notesService.create(createNoteDto, user);
  }

  @Get('leads/:leadId/notes')
  findAllForLead(@Param('leadId') leadId: string, @GetUser() user: any) {
    // Pass user for scoping
    return this.notesService.findAllForLead(leadId, user);
  }

  @Patch('notes/:id')
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @GetUser() user: any,
  ) {
    return this.notesService.update(id, updateNoteDto, user);
  }

  @Delete('notes/:id')
  remove(@Param('id') id: string, @GetUser() user: any) {
    return this.notesService.remove(id, user);
  }
}