import { Module } from '@nestjs/common';
import { DatabaseSync } from 'node:sqlite';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { openDatabase } from './database.js';
import { NotesController } from './notes/notes.controller.js';

@Module({
  imports: [],
  controllers: [AppController, NotesController],
  providers: [
    AppService,
    // DatabaseSync を受け取るクラスに、openDatabase() で開いたデータベースを渡す
    { provide: DatabaseSync, useFactory: openDatabase },
  ],
})
export class AppModule {}
