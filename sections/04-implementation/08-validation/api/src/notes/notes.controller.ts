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
import { z } from 'zod';
import type { CreateNoteInput, Note, UpdateNoteInput } from '../api/index.js';
import { openDatabase } from '../database.js';

/** POST /notes の本文の決まり。openapi.yaml の CreateNoteInput に合わせる。 */
const createNoteSchema = z.strictObject({
  title: z.string().trim().min(1).max(100),
  body: z.string().max(1000).default(''),
}) satisfies z.ZodType<unknown, CreateNoteInput>;

/** PUT /notes/:id の本文の決まり。openapi.yaml の UpdateNoteInput に合わせる。 */
const updateNoteSchema = z.strictObject({
  title: z.string().trim().min(1).max(100),
  body: z.string().max(1000),
}) satisfies z.ZodType<unknown, UpdateNoteInput>;

/** URL の :id。メモの ID は UUID。 */
const noteIdSchema = z.uuid();

@Controller('notes')
export class NotesController {
  private readonly db = openDatabase();

  @Get()
  findAll(): Note[] {
    return this.db
      .prepare('SELECT * FROM notes ORDER BY createdAt')
      .all() as Note[];
  }

  @Post()
  create(
    @Body({ schema: createNoteSchema })
    input: z.infer<typeof createNoteSchema>,
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
    input: z.infer<typeof updateNoteSchema>,
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
