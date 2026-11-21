---
docs: true
title: Update を実装する
---

# Update を実装する

![04 章 Update を実装する](./images/00-thumbnail.svg)

`PUT /notes/{id}`（Update）を実装します。

::diff{file="api/src/notes/notes.controller.ts"}

- `updateNoteSchema` … `UpdateNoteInput` と同じ決まりです。`title` と `body` はどちらも必須で、`default` はありません
- `this.findOne(id)` … Get の処理を使ってメモを探します。無ければ `404` です
- `title: input.title` … 送られた中身でそのまま置き換えます
- `UPDATE` の `?` には、`run()` に並べた値が順に入ります

## 動作確認する

`npm run start:dev` で API を起動したまま、VS Code で `api/openapi.yaml` を開きます。 `put:` の下の **Try it** を押し、`id` に作ったメモの ID を入れ、本文を `{ "title": "買い物", "body": "牛乳とパン" }` にして **Send** を押します。`title` と `body` が置き換わり、`updatedAt` が新しくなったメモが `200` で返れば大丈夫です。`title` か `body` のどちらかを消して送ると `400` になります。

## 参考にした公式ドキュメント

この節は、次の公式ドキュメントをもとに書いています。

- [Node.js: SQLite](https://nodejs.org/docs/latest-v26.x/api/sqlite.html) … `statement.run()` と、`?` への値の入れ方

## この節を終えたときのディレクトリ

::tree

:::download
[この節を終えた状態をダウンロード](./project.zip)
:::
