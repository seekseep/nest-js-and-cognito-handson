---
docs: true
title: 入力チェック
---

# 入力チェック

![04 章 入力チェック](./images/00-thumbnail.svg)

ここまでの実装では、`openapi.yaml` の決まりに合わない入力も受け付けてしまいます。`title` が空のメモも作れますし、`title` だけの `PUT` は `500`（サーバーのエラー）になります。型（`CreateNoteInput` など）は書くときの手助けで、届いた中身は確かめないからです。

そこで、届いた本文と URL の `:id` が `openapi.yaml` の決まりに合っているかを、**Zod** のスキーマで確かめます。合わなければ `400` を返します。

## Zod を入れる

```bash
npm install zod
```

::diff{file="api/package.json" by="command"}

## 確かめる仕組みを登録する

NestJS 12 の `StandardSchemaValidationPipe` を登録すると、`@Body({ schema })` や `@Param('id', { schema })` に渡したスキーマで値を確かめます。

::diff{file="api/src/main.ts"}

## コントローラーにスキーマを書く

::diff{file="api/src/notes/notes.controller.ts"}

- `createNoteSchema` … `CreateNoteInput` と同じ決まりを Zod で書きます。`satisfies z.ZodType<unknown, CreateNoteInput>` で、受け付ける形が `CreateNoteInput` に合っているかを TypeScript が確かめます
- `.default('')` … `body` を省略したら `''` にします。そのため、`input.body ?? ''` は要らなくなります
- `updateNoteSchema` … `UpdateNoteInput` と同じ決まりです。`title` と `body` はどちらも必須です
- `noteIdSchema`（`z.uuid()`）… URL の `:id` が UUID の形かを確かめます
- `z.strictObject()` … 決まりに無い項目（`id` など）を送ると `400` にします

## 動作確認する

`npm run start:dev` で API を起動したまま、VS Code で `api/openapi.yaml` を開き、Try it で次のように送ります。

- `post:` で、`title` を `""` にして送る
- `put:` で、`body` を消して `title` だけを送る
- `/notes/{id}:` の `get:` で、`id` を `abc` にして送る

どれも `400` になれば大丈夫です。`title` が空のときは、次のように返ります。

```json
{
  "message": ["title: Too small: expected string to have >=1 characters"],
  "error": "Bad Request",
  "statusCode": 400
}
```

### curl で確かめる

```bash
curl -i -X POST http://localhost:3000/notes -H 'Content-Type: application/json' -d '{"title": ""}'
```

1 行目が `HTTP/1.1 400 Bad Request` になれば大丈夫です。

最後に、5 つの操作を Try it か curl で順に送り、`openapi.yaml` に書いた応答（`200`・`201`・`204`・`400`・`404`）が返ることを確かめておきます。05 章では、コードを整理するたびに同じ確かめをします。

## 参考にした公式ドキュメント

この節は、次の公式ドキュメントをもとに書いています。

- [NestJS: Validation](https://docs.nestjs.com/application/validation) … `StandardSchemaValidationPipe` と `@Body({ schema })`
- [Zod](https://zod.dev/) … スキーマの書き方

## この節を終えたときのディレクトリ

::tree

:::download
[この節を終えた状態をダウンロード](./project.zip)
:::
