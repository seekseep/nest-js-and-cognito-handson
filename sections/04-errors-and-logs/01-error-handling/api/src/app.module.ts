import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AllExceptionsFilter } from './common/all-exceptions.filter.js';
import { NotesModule } from './notes/notes.module.js';

@Module({
  imports: [NotesModule],
  controllers: [AppController],
  providers: [
    AppService,
    // すべての例外を、ErrorBody の形にそろえる
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
