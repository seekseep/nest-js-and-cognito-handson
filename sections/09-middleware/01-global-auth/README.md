# 09-01 アプリケーション全体の認証認可

`APP_GUARD` で AuthGuard をアプリ全体に掛け、トークン無しで呼べるものだけに `@Public()` を付けた状態です。教材: `LECTURE.md`

## 動かし方

```bash
npm install              # my-app/ 直下。Redocly CLI と openapi-typescript
cp ui/.env.example ui/.env.local   # 自分のユーザープールの値に書き換える
cp api/.env.example api/.env                   # 同じく
podman compose up --build --watch
```

テストは `cd api && npm test` です。
