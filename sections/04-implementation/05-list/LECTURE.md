---
docs: true
title: List を実装する
---

# List を実装する

![04 章 List を実装する](./images/00-thumbnail.svg)

`GET /notes`（List）を実装します。

::diff{file="api/src/notes/notes.controller.ts"}

- `@Get()` … `GET /notes` を受け付けます
- `prepare(...).all()` … すべての行を配列で返します。作った順（`createdAt`）に並べます

## 動作確認する

`npm run start:dev` で API を起動したまま、VS Code で `api/openapi.yaml` を開きます。 `/notes:` の `get:` の下の **Try it** を押して **Send** を押します。これまでに作ったメモが、配列で `200` で返れば大丈夫です。

## 参考にした公式ドキュメント

この節は、次の公式ドキュメントをもとに書いています。

- [Node.js: SQLite](https://nodejs.org/docs/latest-v26.x/api/sqlite.html) … `statement.all()`

## この節を終えたときのディレクトリ

::tree

:::download
[この節を終えた状態をダウンロード](./project.zip)
:::
