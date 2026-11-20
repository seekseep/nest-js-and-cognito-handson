import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard.js';
import { FakeTokenVerifier } from './fake-token-verifier.js';
import { TokenVerifier } from './token-verifier.js';

// E2E テストのときだけ、決め打ちのトークンを通す偽物を使う（playwright.config.ts が true にする）
const useFakeAuth = process.env.USE_FAKE_AUTH === 'true';

@Module({
  providers: [
    {
      provide: TokenVerifier,
      useClass: useFakeAuth ? FakeTokenVerifier : TokenVerifier,
    },
    // AuthGuard をアプリ全体に掛ける。@Public() の付いたものだけがトークン無しで呼べる
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
  // /admin の middleware でも使うので、ほかのモジュールに公開する
  exports: [TokenVerifier],
})
export class AuthModule {}
