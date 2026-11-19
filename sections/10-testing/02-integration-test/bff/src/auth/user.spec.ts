import { isAdmin, type User } from './user.js';

describe('isAdmin', () => {
  it('admin グループに入っていれば true', () => {
    const user = { sub: 'a', 'cognito:groups': ['admin'] } as User;
    expect(isAdmin(user)).toBe(true);
  });

  it('ほかのグループだけなら false', () => {
    const user = { sub: 'a', 'cognito:groups': ['staff'] } as User;
    expect(isAdmin(user)).toBe(false);
  });

  it('どのグループにも入っていなければ false', () => {
    // グループが 1 つも無いと、トークンに cognito:groups そのものが無い
    const user = { sub: 'a' } as User;
    expect(isAdmin(user)).toBe(false);
  });
});
