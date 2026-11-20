# 09-04 ロギング

リクエストごとに、メソッド・パス・ステータス・かかった時間・ユーザーをログに出す middleware を入れた状態です。教材: `LECTURE.md`

## 動かし方

```bash
npm install              # my-app/ 直下。Redocly CLI と openapi-typescript
cp ui/.env.example ui/.env.local   # 自分のユーザープールの値に書き換える
cp api/.env.example api/.env                   # 同じく
podman compose up --build --watch
```

テストは `cd api && npm test` です。
