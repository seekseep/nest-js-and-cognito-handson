import { Module } from '@nestjs/common';
import { DatabaseSync } from 'node:sqlite';
import { openDatabase } from '../database.js';
import { NotesController } from './notes.controller.js';
import { NotesService } from './notes.service.js';

@Module({
  controllers: [NotesController],
  providers: [
    NotesService,
    // DatabaseSync を受け取るクラスに、openDatabase() で開いたデータベースを渡す
    { provide: DatabaseSync, useFactory: openDatabase },
  ],
})
export class NotesModule {}
