import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  createNoteSchema,
  noteIdSchema,
  updateNoteSchema,
  type CreateNoteInput,
  type Note,
  type UpdateNoteInput,
} from './note.js';
import { NotesService } from './notes.service.js';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAll(): Note[] {
    return this.notesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', { schema: noteIdSchema }) id: string): Note {
    return this.notesService.findOne(id);
  }

  @Post()
  create(@Body({ schema: createNoteSchema }) input: CreateNoteInput): Note {
    return this.notesService.create(input);
  }

  @Patch(':id')
  update(
    @Param('id', { schema: noteIdSchema }) id: string,
    @Body({ schema: updateNoteSchema }) input: UpdateNoteInput,
  ): Note {
    return this.notesService.update(id, input);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', { schema: noteIdSchema }) id: string): void {
    this.notesService.remove(id);
  }
}
