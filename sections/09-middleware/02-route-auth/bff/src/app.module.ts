import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { NotesModule } from './notes/notes.module.js';

@Module({
  imports: [AuthModule, NotesModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
