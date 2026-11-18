import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AdminModule } from './admin/admin.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { AllExceptionsFilter } from './common/all-exceptions.filter.js';
import { NotesModule } from './notes/notes.module.js';

@Module({
  imports: [AuthModule, NotesModule, AdminModule],
  controllers: [AppController],
  providers: [
    AppService,
    // すべての例外を、openapi.yaml の Error の形にそろえる
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
