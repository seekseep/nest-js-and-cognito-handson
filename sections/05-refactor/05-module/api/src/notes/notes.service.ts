import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DatabaseSync } from 'node:sqlite';
import type { CreateNoteDto } from './dto/create-note.dto.js';
import type { UpdateNoteDto } from './dto/update-note.dto.js';
import type { Note } from './entities/note.entity.js';

@Injectable()
export class NotesService {
  constructor(private readonly db: DatabaseSync) {}

  findAll(): Note[] {
    return this.db
      .prepare('SELECT * FROM notes ORDER BY createdAt')
      .all() as Note[];
  }

  create(input: CreateNoteDto): Note {
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

  findOne(id: string): Note {
    const note = this.db.prepare('SELECT * FROM notes WHERE id = ?').get(id) as
      Note | undefined;
    if (!note) {
      throw new NotFoundException(`Note ${id} not found`);
    }
    return note;
  }

  update(id: string, input: UpdateNoteDto): Note {
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

  remove(id: string): void {
    const result = this.db.prepare('DELETE FROM notes WHERE id = ?').run(id);
    if (result.changes === 0) {
      throw new NotFoundException(`Note ${id} not found`);
    }
  }
}
