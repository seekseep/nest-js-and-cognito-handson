# 08-01 生成した型を使う

API のメモと `/me` の型を、`openapi.yaml` から作った型に置き換え、Zod のスキーマが約束と合っているかをコンパイルのときに確かめるようにした状態です。教材: `LECTURE.md`

## 動かし方

```bash
npm install              # my-app/ 直下。Redocly CLI と openapi-typescript
npm run generate:api     # openapi.yaml を変えたら型を作り直す

cp ui/.env.example ui/.env.local   # 自分のユーザープールの値に書き換える
cp api/.env.example api/.env                   # 同じく
podman compose up --build --watch
```
