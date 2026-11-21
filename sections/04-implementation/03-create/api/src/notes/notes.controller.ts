import { Body, Controller, Post } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { CreateNoteInput, Note } from '../api/index.js';
import { openDatabase } from '../database.js';

@Controller('notes')
export class NotesController {
  private readonly db = openDatabase();

  @Post()
  create(@Body() input: CreateNoteInput): Note {
    const now = new Date().toISOString();
    const note: Note = {
      id: randomUUID(),
      title: input.title,
      body: input.body ?? '',
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
