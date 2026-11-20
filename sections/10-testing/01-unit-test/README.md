# 10-01 単体テスト

API の `isAdmin()`・`AuthGuard`・`AdminMiddleware` に、相手を偽物（モック）にした単体テストを足した状態です。教材: `LECTURE.md`

## 動かし方

```bash
npm install              # my-app/ 直下。Redocly CLI と openapi-typescript
cp ui/.env.example ui/.env.local   # 自分のユーザープールの値に書き換える
cp api/.env.example api/.env                   # 同じく
podman compose up --build --watch
```

## テスト

```bash
cd api
npm install
npm test           # 単体テスト
npm run test:cov   # カバレッジ（api/coverage/index.html）
```
