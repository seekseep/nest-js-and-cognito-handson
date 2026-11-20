import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('greeting')
  getGreeting(@Query('name') name?: string) {
    return this.appService.getGreeting(name);
  }

  @Post('echo')
  echo(@Body() body: unknown) {
    return { received: body };
  }
}
