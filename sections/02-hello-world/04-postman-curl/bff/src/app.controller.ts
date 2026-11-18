import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('greeting')
  getGreeting(@Query('name') name?: string) {
    return { message: `Hello, ${name ?? 'World'}!` };
  }

  @Post('echo')
  echo(@Body() body: unknown) {
    return { received: body };
  }
}
