import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import { z } from 'zod';
import type { components } from '../api/schema.js';
import { createNoteSchema, type CreateNoteDto } from './dto/create-note.dto.js';
import { updateNoteSchema, type UpdateNoteDto } from './dto/update-note.dto.js';

type Note = components['schemas']['Note'];

/** URL の :id。メモの ID は UUID。 */
const noteIdSchema = z.uuid();

@Controller('notes')
export class NotesController {
  constructor(private readonly db: DatabaseSync) {}

  @Get()
  findAll(): Note[] {
    return this.db
      .prepare('SELECT * FROM notes ORDER BY createdAt')
      .all() as Note[];
  }

  @Post()
  create(
    @Body({ schema: createNoteSchema })
    input: CreateNoteDto,
  ): Note {
    const now = new Date().toISOString();
    const note: Note = {
      id: randomUUID(),
      title: input.title,
      body: input.body,
      createdAt: now,
      updatedAt: now,
    };
    this.db
      .prepare(
        'INSERT INTO notes (id, title, body, createdAt, updatedAt) VALUES (:id, :title, :body, :createdAt, :updatedAt)',
      )
      .run(note);
    return note;
  }

  @Get(':id')
  findOne(@Param('id', { schema: noteIdSchema }) id: string): Note {
    const note = this.db.prepare('SELECT * FROM notes WHERE id = ?').get(id) as
      Note | undefined;
    if (!note) {
      throw new NotFoundException(`Note ${id} not found`);
    }
    return note;
  }

  @Put(':id')
  update(
    @Param('id', { schema: noteIdSchema }) id: string,
    @Body({ schema: updateNoteSchema })
    input: UpdateNoteDto,
  ): Note {
    const note = this.findOne(id);
    const updated: Note = {
      ...note,
      title: input.title,
      body: input.body,
      updatedAt: new Date().toISOString(),
    };
    this.db
      .prepare(
        'UPDATE notes SET title = ?, body = ?, updatedAt = ? WHERE id = ?',
      )
      .run(updated.title, updated.body, updated.updatedAt, id);
    return updated;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', { schema: noteIdSchema }) id: string): void {
    const result = this.db.prepare('DELETE FROM notes WHERE id = ?').run(id);
    if (result.changes === 0) {
      throw new NotFoundException(`Note ${id} not found`);
    }
  }
}
