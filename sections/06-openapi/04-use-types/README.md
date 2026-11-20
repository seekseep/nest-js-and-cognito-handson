# 06-04 生成した型を使う

生成した型を、メモ・エラーの型と Zod のスキーマの照らし合わせに使った状態です。教材: `LECTURE.md`

## 動かし方

```bash
cd api
npm install
npm run start:dev    # http://localhost:3000/
```

`openapi.yaml` を確かめるときは `npm run lint:api`、型を作り直すときは `npm run generate:api` を実行します。
