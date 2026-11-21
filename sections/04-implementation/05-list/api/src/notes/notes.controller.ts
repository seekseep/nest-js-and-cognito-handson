import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { CreateNoteInput, Note } from '../api/index.js';
import { openDatabase } from '../database.js';

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

  @Get(':id')
  findOne(@Param('id') id: string): Note {
    const note = this.db.prepare('SELECT * FROM notes WHERE id = ?').get(id) as
      Note | undefined;
    if (!note) {
      throw new NotFoundException(`Note ${id} not found`);
    }
    return note;
  }
}
