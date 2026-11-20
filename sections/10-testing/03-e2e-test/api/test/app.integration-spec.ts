import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { setupApp } from '../src/app.setup.js';
import { FakeTokenVerifier } from '../src/auth/fake-token-verifier.js';
import { TokenVerifier } from '../src/auth/token-verifier.js';

/** 決め打ちのトークンを Authorization ヘッダーにする。 */
function as(token: string) {
  return { Authorization: `Bearer ${token}` };
}

describe('API（結合テスト）', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      // トークンの検証だけを、決め打ちのトークンを通す偽物に差し替える
      .overrideProvider(TokenVerifier)
      .useClass(FakeTokenVerifier)
      .compile();

    // テスト中は、リクエストごとのログを出さない
    app = moduleRef.createNestApplication({ logger: false });
    setupApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('認証', () => {
    it('GET / は、トークン無しで呼べる', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });

    it('トークンが無ければ 401 で、エラーの形がそろっている', async () => {
      const res = await request(app.getHttpServer()).get('/notes').expect(401);
      expect(res.body).toMatchObject({
        statusCode: 401,
        error: 'Unauthorized',
        messages: ['Missing bearer token'],
        path: '/notes',
      });
    });

    it('知らないトークンは 401', () => {
      return request(app.getHttpServer())
        .get('/notes')
        .set(as('nobody-token'))
        .expect(401);
    });

    it('GET /me は、トークンのユーザーを返す', async () => {
      const res = await request(app.getHttpServer())
        .get('/me')
        .set(as('alice-token'))
        .expect(200);
      expect(res.body).toMatchObject({ sub: 'alice' });
    });
  });

  describe('メモ', () => {
    it('作ったメモが一覧に出て、消すと 404 になる', async () => {
      const server = app.getHttpServer();

      const created = await request(server)
        .post('/notes')
        .set(as('alice-token'))
        .send({ title: '買い物', body: '牛乳' })
        .expect(201);
      expect(created.body).toMatchObject({
        title: '買い物',
        body: '牛乳',
        ownerId: 'alice',
      });
      const id = (created.body as { id: string }).id;

      const list = await request(server)
        .get('/notes')
        .set(as('alice-token'))
        .expect(200);
      expect(list.body).toHaveLength(1);

      await request(server)
        .delete(`/notes/${id}`)
        .set(as('alice-token'))
        .expect(204);
      await request(server)
        .get(`/notes/${id}`)
        .set(as('alice-token'))
        .expect(404);
    });

    it('タイトルが空なら 400 で、理由が messages に入る', async () => {
      const res = await request(app.getHttpServer())
        .post('/notes')
        .set(as('alice-token'))
        .send({ title: '' })
        .expect(400);
      expect(res.body.messages).toEqual([expect.stringContaining('title')]);
    });
  });

  describe('認可', () => {
    it('他の人のメモは読めない', async () => {
      const server = app.getHttpServer();
      const created = await request(server)
        .post('/notes')
        .set(as('alice-token'))
        .send({ title: 'alice のメモ' })
        .expect(201);
      const id = (created.body as { id: string }).id;

      await request(server)
        .get(`/notes/${id}`)
        .set(as('bob-token'))
        .expect(403);
      const list = await request(server)
        .get('/notes')
        .set(as('bob-token'))
        .expect(200);
      expect(list.body).toEqual([]);
    });

    it('/admin/notes は admin だけが呼べる', async () => {
      const server = app.getHttpServer();
      await request(server)
        .post('/notes')
        .set(as('alice-token'))
        .send({ title: 'alice のメモ' })
        .expect(201);

      await request(server)
        .get('/admin/notes')
        .set(as('bob-token'))
        .expect(403);
      const res = await request(server)
        .get('/admin/notes')
        .set(as('admin-token'))
        .expect(200);
      expect(res.body).toHaveLength(1);
    });
  });
});
