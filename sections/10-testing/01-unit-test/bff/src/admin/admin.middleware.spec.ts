import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import type { Response } from 'express';
import type { AuthenticatedRequest } from '../auth/auth.guard.js';
import { TokenVerifier } from '../auth/token-verifier.js';
import type { User } from '../auth/user.js';
import { AdminMiddleware } from './admin.middleware.js';

const alice = { sub: 'alice' } as User;
const admin = { sub: 'admin', 'cognito:groups': ['admin'] } as User;

describe('AdminMiddleware', () => {
  const verify = vi.fn<TokenVerifier['verify']>();
  const middleware = new AdminMiddleware({
    verify,
  } as unknown as TokenVerifier);
  const res = {} as Response;

  beforeEach(() => {
    verify.mockReset();
  });

  it('admin なら request.user に入れて、次へ進める', async () => {
    verify.mockResolvedValue(admin);
    const req = { headers: {} } as AuthenticatedRequest;
    const next = vi.fn();

    await middleware.use(req, res, next);

    expect(req.user).toBe(admin);
    expect(next).toHaveBeenCalledOnce();
  });

  it('admin でなければ 403 で、次へは進めない', async () => {
    verify.mockResolvedValue(alice);
    const next = vi.fn();

    await expect(
      middleware.use({ headers: {} } as AuthenticatedRequest, res, next),
    ).rejects.toThrow(ForbiddenException);
    expect(next).not.toHaveBeenCalled();
  });

  it('トークンが無ければ 401', async () => {
    verify.mockRejectedValue(new UnauthorizedException('Missing bearer token'));
    const next = vi.fn();

    await expect(
      middleware.use({ headers: {} } as AuthenticatedRequest, res, next),
    ).rejects.toThrow(UnauthorizedException);
    expect(next).not.toHaveBeenCalled();
  });
});
