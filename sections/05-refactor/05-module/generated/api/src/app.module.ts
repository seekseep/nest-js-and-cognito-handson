import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { NotesController } from './notes/notes.controller.js';
import { DatabaseModule } from './database/database.module.js';
import { NotesService } from './notes/notes.service.js';
import { NotesModule } from './notes/notes.module.js';

@Module({
  imports: [DatabaseModule, NotesModule],
  controllers: [AppController, NotesController],
  providers: [AppService, NotesService],
})
export class AppModule {}
