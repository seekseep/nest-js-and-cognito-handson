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
import { CurrentUser } from '../auth/current-user.decorator.js';
import type { User } from '../auth/user.js';
import { NotesService } from './notes.service.js';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAll(@CurrentUser() user: User): Note[] {
    return this.notesService.findAll(user);
  }

  @Get(':id')
  findOne(
    @Param('id', { schema: noteIdSchema }) id: string,
    @CurrentUser() user: User,
  ): Note {
    return this.notesService.findOne(id, user);
  }

  @Post()
  create(
    @Body({ schema: createNoteSchema }) input: CreateNoteInput,
    @CurrentUser() user: User,
  ): Note {
    return this.notesService.create(input, user);
  }

  @Patch(':id')
  update(
    @Param('id', { schema: noteIdSchema }) id: string,
    @Body({ schema: updateNoteSchema }) input: UpdateNoteInput,
    @CurrentUser() user: User,
  ): Note {
    return this.notesService.update(id, input, user);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(
    @Param('id', { schema: noteIdSchema }) id: string,
    @CurrentUser() user: User,
  ): void {
    this.notesService.remove(id, user);
  }
}
