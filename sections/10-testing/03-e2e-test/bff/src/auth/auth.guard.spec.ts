import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard, type AuthenticatedRequest } from './auth.guard.js';
import { Public } from './public.decorator.js';
import { TokenVerifier } from './token-verifier.js';
import type { User } from './user.js';

const alice = { sub: 'alice' } as User;

// @Public() の付いたメソッドと、付いていないメソッドを持つ、テスト用のコントローラー
class TestController {
  @Public()
  open() {}

  closed() {}
}

/** Guard に渡す ExecutionContext のまね。Guard が使うメソッドだけを用意する。 */
function contextFor(
  method: 'open' | 'closed',
  request: Partial<AuthenticatedRequest>,
): ExecutionContext {
  return {
    // 呼ばれるメソッド。@Public() の印は、このメソッドに貼られている
    getHandler: () => Reflect.get(TestController.prototype, method),
    getClass: () => TestController,
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('AuthGuard', () => {
  // TokenVerifier の代わりに、呼ばれ方を記録する偽物（モック）を使う
  const verify = vi.fn<TokenVerifier['verify']>();
  const guard = new AuthGuard(new Reflector(), {
    verify,
  } as unknown as TokenVerifier);

  beforeEach(() => {
    verify.mockReset();
  });

  it('@Public() が付いていれば、トークンを確かめずに通す', async () => {
    const context = contextFor('open', { headers: {} });
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(verify).not.toHaveBeenCalled();
  });

  it('正しいトークンなら、中身を request.user に入れて通す', async () => {
    verify.mockResolvedValue(alice);
    const request = { headers: { authorization: 'Bearer good' } };
    const context = contextFor('closed', request);

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(verify).toHaveBeenCalledWith('Bearer good');
    expect(request).toHaveProperty('user', alice);
  });

  it('トークンが正しくなければ、401 の例外をそのまま投げる', async () => {
    verify.mockRejectedValue(new UnauthorizedException('Invalid token'));
    const context = contextFor('closed', {
      headers: { authorization: 'Bearer bad' },
    });

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('middleware が request.user を入れていれば、もう一度は確かめない', async () => {
    const context = contextFor('closed', {
      headers: {},
      user: alice,
    });
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(verify).not.toHaveBeenCalled();
  });
});
