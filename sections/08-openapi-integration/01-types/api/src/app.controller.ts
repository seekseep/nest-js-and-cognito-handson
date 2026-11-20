import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import type { CognitoAccessTokenPayload } from 'aws-jwt-verify/jwt-model';
import type { components } from './api/schema.js';
import { AppService } from './app.service.js';
import { AuthGuard } from './auth/auth.guard.js';
import { CurrentUser } from './auth/current-user.decorator.js';

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

  // このメソッドだけに Guard を掛ける。トークンの中身から、誰がサインインしているかを返す
  @Get('me')
  @UseGuards(AuthGuard)
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
