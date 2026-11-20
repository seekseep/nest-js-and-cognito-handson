# 06-01 認証 — トークンを検証する

API に自作の Guard（aws-jwt-verify）を入れ、Cognito のアクセストークンが無いとメモ API を呼べないようにした状態です。教材: `LECTURE.md`

## 動かし方

```bash
cp ui/.env.example ui/.env.local   # 自分のユーザープールの値に書き換える
cp api/.env.example api/.env                   # 同じく
podman compose up --build --watch              # http://localhost:3000 と http://localhost:3001
```

Podman を使わずに API を動かすときは `cd api && npm run start:dev -- --env-file .env` です。
