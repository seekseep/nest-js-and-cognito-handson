# 10-01 単体テスト

BFF の `isAdmin()`・`AuthGuard`・`AdminMiddleware` に、相手を偽物（モック）にした単体テストを足した状態です。教材: `LECTURE.md`

## 動かし方

```bash
npm install              # my-app/ 直下。Redocly CLI と openapi-typescript
cp frontend/.env.example frontend/.env.local   # 自分のユーザープールの値に書き換える
cp bff/.env.example bff/.env                   # 同じく
podman compose up --build --watch
```

## テスト

```bash
cd bff
npm install
npm test           # 単体テスト
npm run test:cov   # カバレッジ（bff/coverage/index.html）
```
