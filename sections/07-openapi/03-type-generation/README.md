# 07-03 型生成の設定

`openapi.yaml` から、openapi-typescript で frontend と bff の TypeScript の型を作れるようにした状態です。教材: `LECTURE.md`

## 動かし方

```bash
npm install              # my-app/ 直下。Redocly CLI と openapi-typescript が入る
npm run lint:api         # openapi.yaml を確かめる
npm run generate:api     # frontend/lib/api/schema.d.ts と bff/src/api/schema.d.ts を作る
npm run check:api        # 型が openapi.yaml と合っているか確かめる

cp frontend/.env.example frontend/.env.local   # 自分のユーザープールの値に書き換える
cp bff/.env.example bff/.env                   # 同じく
podman compose up --build --watch
```
