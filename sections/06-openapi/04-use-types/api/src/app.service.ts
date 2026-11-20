import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getGreeting(name?: string): { message: string } {
    return { message: `Hello, ${name ?? 'World'}!` };
  }
}
