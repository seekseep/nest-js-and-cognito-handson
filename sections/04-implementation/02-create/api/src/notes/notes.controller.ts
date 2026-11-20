import { Body, Controller, Post } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import type { components } from '../api/schema.js';
import { openDatabase } from '../database.js';

type Note = components['schemas']['Note'];
type CreateNoteInput = components['schemas']['CreateNoteInput'];

/** POST /notes の本文の決まり。openapi.yaml の CreateNoteInput に合わせる。 */
const createNoteSchema = z.strictObject({
  title: z.string().trim().min(1).max(100),
  body: z.string().max(1000).default(''),
}) satisfies z.ZodType<unknown, CreateNoteInput>;

@Controller('notes')
export class NotesController {
  private readonly db = openDatabase();

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
}
