# 07-03 型生成の設定

`openapi.yaml` から、openapi-typescript で UI と API の TypeScript の型を作れるようにした状態です。教材: `LECTURE.md`

## 動かし方

```bash
npm install              # my-app/ 直下。Redocly CLI と openapi-typescript が入る
npm run lint:api         # openapi.yaml を確かめる
npm run generate:api     # ui/lib/api/schema.d.ts と api/src/api/schema.d.ts を作る
npm run check:api        # 型が openapi.yaml と合っているか確かめる

cp ui/.env.example ui/.env.local   # 自分のユーザープールの値に書き換える
cp api/.env.example api/.env                   # 同じく
podman compose up --build --watch
```
