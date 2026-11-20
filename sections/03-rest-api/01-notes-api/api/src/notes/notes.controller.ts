import { Body, Controller, Get, Post } from '@nestjs/common';
import type { CreateNoteDto } from './dto/create-note.dto.js';
import type { Note } from './entities/note.entity.js';
import { NotesService } from './notes.service.js';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAll(): Note[] {
    return this.notesService.findAll();
  }

  @Post()
  create(@Body() createNoteDto: CreateNoteDto): Note {
    return this.notesService.create(createNoteDto);
  }
}
