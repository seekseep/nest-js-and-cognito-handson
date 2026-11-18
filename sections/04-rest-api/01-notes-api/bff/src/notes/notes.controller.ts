import { Body, Controller, Get, Post } from '@nestjs/common';
import type { CreateNoteInput, Note } from './note.js';
import { NotesService } from './notes.service.js';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAll(): Note[] {
    return this.notesService.findAll();
  }

  @Post()
  create(@Body() input: CreateNoteInput): Note {
    return this.notesService.create(input);
  }
}
