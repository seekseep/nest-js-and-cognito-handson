# 09-03 エラーハンドリング

グローバルの ExceptionFilter で、API のエラーの形を `openapi.yaml` の `Error` にそろえた状態です。教材: `LECTURE.md`

## 動かし方

```bash
npm install              # my-app/ 直下。Redocly CLI と openapi-typescript
cp ui/.env.example ui/.env.local   # 自分のユーザープールの値に書き換える
cp api/.env.example api/.env                   # 同じく
podman compose up --build --watch
```

テストは `cd api && npm test` です。
