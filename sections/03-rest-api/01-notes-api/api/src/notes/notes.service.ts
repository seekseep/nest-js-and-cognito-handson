import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { CreateNoteDto } from './dto/create-note.dto.js';
import type { Note } from './entities/note.entity.js';

@Injectable()
export class NotesService {
  // メモはメモリ上に持つ。API を再起動すると消える。
  private readonly notes: Note[] = [];

  findAll(): Note[] {
    return this.notes;
  }

  create(createNoteDto: CreateNoteDto): Note {
    const now = new Date().toISOString();
    const note: Note = {
      id: randomUUID(),
      title: createNoteDto.title,
      body: createNoteDto.body,
      createdAt: now,
      updatedAt: now,
    };
    this.notes.push(note);
    return note;
  }
}
