import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { CreateNoteInput, Note, UpdateNoteInput } from './note.js';

@Injectable()
export class NotesService {
  // メモはメモリ上に持つ。API を再起動すると消える。
  private readonly notes: Note[] = [];

  findAll(): Note[] {
    return this.notes;
  }

  findOne(id: string): Note {
    const note = this.notes.find((n) => n.id === id);
    if (!note) {
      throw new NotFoundException(`Note ${id} not found`);
    }
    return note;
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

  update(id: string, input: UpdateNoteInput): Note {
    const note = this.findOne(id);
    if (input.title !== undefined) note.title = input.title;
    if (input.body !== undefined) note.body = input.body;
    note.updatedAt = new Date().toISOString();
    return note;
  }

  remove(id: string): void {
    const note = this.findOne(id);
    this.notes.splice(this.notes.indexOf(note), 1);
  }
}
