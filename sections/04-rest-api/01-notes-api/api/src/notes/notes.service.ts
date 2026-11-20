import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { CreateNoteInput, Note } from './note.js';

@Injectable()
export class NotesService {
  // メモはメモリ上に持つ。API を再起動すると消える。
  private readonly notes: Note[] = [];

  findAll(): Note[] {
    return this.notes;
  }

  create(input: CreateNoteInput): Note {
    const now = new Date().toISOString();
    const note: Note = {
      id: randomUUID(),
      title: input.title,
      body: input.body,
      createdAt: now,
      updatedAt: now,
    };
    this.notes.push(note);
    return note;
  }
}
