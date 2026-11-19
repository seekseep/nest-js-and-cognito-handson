import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenVerifier } from './token-verifier.js';
import type { User } from './user.js';

/**
 * テスト用の、決め打ちのトークンと、それが表すユーザー。
 * 本物の Cognito のトークンではなく、ただの文字列。
 */
export const FAKE_TOKENS: Record<string, User> = {
  'alice-token': { sub: 'alice' } as User,
  'bob-token': { sub: 'bob' } as User,
  'admin-token': { sub: 'admin', 'cognito:groups': ['admin'] } as User,
};

/**
 * テストで TokenVerifier の代わりに使う。Cognito には問い合わせず、
 * FAKE_TOKENS に書いたトークンだけを通す。本番では使わない。
 */
@Injectable()
export class FakeTokenVerifier implements Pick<TokenVerifier, 'verify'> {
  verify(authorization: string | undefined): Promise<User> {
    const [type, token] = authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Missing bearer token');
    }
    const user = FAKE_TOKENS[token];
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return Promise.resolve(user);
  }
}
