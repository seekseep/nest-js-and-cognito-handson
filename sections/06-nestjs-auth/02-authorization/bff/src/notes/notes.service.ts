import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { isAdmin, type User } from '../auth/user.js';
import type { CreateNoteInput, Note, UpdateNoteInput } from './note.js';

@Injectable()
export class NotesService {
  // メモはメモリ上に持つ。BFF を再起動すると消える。
  private readonly notes: Note[] = [];

  /** admin なら全員のメモを、そうでなければ自分のメモだけを返す。 */
  findAll(user: User): Note[] {
    if (isAdmin(user)) return this.notes;
    return this.notes.filter((n) => n.ownerId === user.sub);
  }

  /** 持ち主か admin でなければ 403 にする。 */
  findOne(id: string, user: User): Note {
    const note = this.notes.find((n) => n.id === id);
    if (!note) {
      throw new NotFoundException(`Note ${id} not found`);
    }
    if (note.ownerId !== user.sub && !isAdmin(user)) {
      throw new ForbiddenException(`Note ${id} is not yours`);
    }
    return note;
  }

  create(input: CreateNoteInput, user: User): Note {
    const now = new Date().toISOString();
    const note: Note = {
      id: randomUUID(),
      ownerId: user.sub,
      title: input.title,
      body: input.body,
      createdAt: now,
      updatedAt: now,
    };
    this.notes.push(note);
    return note;
  }

  update(id: string, input: UpdateNoteInput, user: User): Note {
    const note = this.findOne(id, user);
    if (input.title !== undefined) note.title = input.title;
    if (input.body !== undefined) note.body = input.body;
    note.updatedAt = new Date().toISOString();
    return note;
  }

  remove(id: string, user: User): void {
    const note = this.findOne(id, user);
    this.notes.splice(this.notes.indexOf(note), 1);
  }
}
