import {
  ArgumentsHost,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exceptions.filter.js';

/** filter が返したもの（本文とステータス）を受け取るための、HTTP アダプターのまね。 */
function setup() {
  const reply = vi.fn();
  const adapterHost = {
    httpAdapter: { reply, getRequestUrl: () => '/notes' },
  } as unknown as HttpAdapterHost;
  const host = {
    switchToHttp: () => ({ getRequest: () => ({}), getResponse: () => ({}) }),
  } as unknown as ArgumentsHost;
  return { filter: new AllExceptionsFilter(adapterHost), host, reply };
}

describe('AllExceptionsFilter', () => {
  it('入力チェックのエラーは、説明を配列のまま messages に入れる', () => {
    const { filter, host, reply } = setup();
    filter.catch(new BadRequestException(['title: Too small', 'x']), host);
    const [, body, status] = reply.mock.calls[0];
    expect(status).toBe(400);
    expect(body).toMatchObject({
      statusCode: 400,
      error: 'Bad Request',
      messages: ['title: Too small', 'x'],
      path: '/notes',
    });
  });

  it('説明が 1 つのエラーも、配列にそろえる', () => {
    const { filter, host, reply } = setup();
    filter.catch(new NotFoundException('Note 1 not found'), host);
    const [, body] = reply.mock.calls[0];
    expect(body.messages).toEqual(['Note 1 not found']);
  });

  it('思いがけない例外は 500 にして、中身を返さない', () => {
    const { filter, host, reply } = setup();
    const log = vi
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => {});
    filter.catch(new Error('DB のパスワードが違う'), host);
    const [, body, status] = reply.mock.calls[0];
    expect(status).toBe(500);
    expect(body.messages).toEqual(['Internal server error']);
    expect(JSON.stringify(body)).not.toContain('パスワード');
    expect(log).toHaveBeenCalled();
  });
});
