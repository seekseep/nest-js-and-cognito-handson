import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import type { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import type { components } from './api/schema.js';
import { AppService } from './app.service.js';
import { CurrentUser } from './auth/current-user.decorator.js';
import { Public } from './auth/public.decorator.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('greeting')
  getGreeting(@Query('name') name?: string) {
    return { message: `Hello, ${name ?? 'World'}!` };
  }

  @Public()
  @Post('echo')
  echo(@Body() body: unknown) {
    return { received: body };
  }

  // トークンの中身から、誰がサインインしているかを返す（アプリ全体の Guard が確かめる）
  @Get('me')
  getMe(
    @CurrentUser() user: CognitoAccessTokenPayload,
  ): components['schemas']['Me'] {
    return {
      sub: user.sub,
      username: user.username,
      groups: user['cognito:groups'] ?? [],
    };
  }
}
