import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { z } from 'zod';
import { createNoteSchema, type CreateNoteDto } from './dto/create-note.dto.js';
import { updateNoteSchema, type UpdateNoteDto } from './dto/update-note.dto.js';
import type { Note } from './entities/note.entity.js';
import { NotesService } from './notes.service.js';

/** URL の :id。メモの ID は UUID。 */
const noteIdSchema = z.uuid();

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAll(): Note[] {
    return this.notesService.findAll();
  }

  @Post()
  create(@Body({ schema: createNoteSchema }) input: CreateNoteDto): Note {
    return this.notesService.create(input);
  }

  @Get(':id')
  findOne(@Param('id', { schema: noteIdSchema }) id: string): Note {
    return this.notesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', { schema: noteIdSchema }) id: string,
    @Body({ schema: updateNoteSchema }) input: UpdateNoteDto,
  ): Note {
    return this.notesService.update(id, input);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', { schema: noteIdSchema }) id: string): void {
    this.notesService.remove(id);
  }
}
