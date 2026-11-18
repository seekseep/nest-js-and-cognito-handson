# 09-02 パス単位の認証認可

`/admin` の下を、middleware（`forRoutes`）で admin グループの人だけにした状態です。教材: `LECTURE.md`

## 動かし方

```bash
npm install              # my-app/ 直下。Redocly CLI と openapi-typescript
cp frontend/.env.example frontend/.env.local   # 自分のユーザープールの値に書き換える
cp bff/.env.example bff/.env                   # 同じく
podman compose up --build --watch
```

テストは `cd bff && npm test` です。
