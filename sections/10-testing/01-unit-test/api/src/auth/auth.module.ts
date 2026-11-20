import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard.js';
import { TokenVerifier } from './token-verifier.js';

@Module({
  providers: [
    TokenVerifier,
    // AuthGuard をアプリ全体に掛ける。@Public() の付いたものだけがトークン無しで呼べる
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
  // /admin の middleware でも使うので、ほかのモジュールに公開する
  exports: [TokenVerifier],
})
export class AuthModule {}
