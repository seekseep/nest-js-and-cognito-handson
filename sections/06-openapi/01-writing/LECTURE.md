---
docs: true
title: OpenAPI の書き方
---

# OpenAPI の書き方

![06 章 OpenAPI の書き方](./images/00-thumbnail.svg)

ここまでで、メモ API の形（URL・メソッド・送る JSON・返る JSON）は、API のコードの中にしか書かれていません。API を呼ぶ人は、コードを読まないと何を送れば何が返るのかが分かりません。

この章では、API の形を **OpenAPI** で 1 つのファイルにまとめ、そこから API のコードで使う型を作ります。この節では、そのファイル `openapi.yaml` を書きます。

## OpenAPI とは

**OpenAPI** は、HTTP の API を YAML（または JSON）で書くための決まりです。どんなパスがあり、何を送ると何が返るかを、人にも道具にも読める形で書けます。

このハンズオンでは、`openapi.yaml` を「API の約束」の正本にします。今あるコードの形を `openapi.yaml` に書き起こし、この先は `openapi.yaml` を先に直してからコードを直します。

## openapi.yaml を書く

`api/` の直下（`package.json` と同じ階層）に置きます。

::diff{file="api/openapi.yaml"}

メモの API（`/notes`）だけを書いています（練習用の `/greeting` と `/echo` は載せません）。

先頭の `openapi` は OpenAPI の版、`info` は API の名前と説明、`servers` は API の URL です。

### paths — パスと操作

`paths` の下に、パスごとに、メソッド（`get`・`post`・`patch`・`delete`）ごとの操作を書きます。

```yaml
  /notes:
    get:
      tags: [notes]
      operationId: listNotes
      summary: メモの一覧を返す
      responses:
        '200':
          description: メモの一覧
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Note'
```

| キー | 意味 |
|---|---|
| `operationId` | 操作の名前。型やドキュメントで、この名前が使われる |
| `requestBody` | 送る本文（`POST`・`PATCH`） |
| `responses` | ステータスコードごとの応答。`'200'` のように文字列で書く |
| `$ref` | 別の場所の定義を参照する。`#/components/schemas/Note` は「このファイルの `components.schemas.Note`」 |

### components — 使い回す部品

使い回す形を `components` にまとめ、`$ref` で参照します。`parameters` に `{id}`（`NoteId`）、`responses` に `400`・`404` の応答、`schemas` に JSON の形を書いています。`schemas` とコードの対応は次のとおりです。

| `openapi.yaml` | コード |
|---|---|
| `Note` | `notes/entities/note.entity.ts` の `Note` |
| `CreateNoteInput` | `notes/dto/create-note.dto.ts` の `createNoteSchema` |
| `UpdateNoteInput` | `notes/dto/update-note.dto.ts` の `updateNoteSchema` |
| `Error` | `common/all-exceptions.filter.ts` の `ErrorBody` |

Zod の書き方は、次のように書き換えます。

| Zod | OpenAPI |
|---|---|
| `z.strictObject({...})` | `type: object` と `additionalProperties: false` |
| 省略できない項目 | `required: [...]` に名前を並べる |
| `z.string().min(1).max(100)` | `type: string`・`minLength: 1`・`maxLength: 100` |
| `.default('')` | `default: ''` |
| `z.uuid()` | `type: string`・`format: uuid` |

:::notice
`openapi.yaml` は約束を書いただけなので、ここで API の動きは何も変わりません。約束とコードを結び付けるのは、この章の 04 節です。
:::

## 参考にした公式ドキュメント

この節は、次の公式ドキュメントをもとに書いています。

- [OpenAPI Specification v3.1.1](https://spec.openapis.org/oas/v3.1.1.html) … `openapi.yaml` に書ける項目

## この節を終えたときのディレクトリ

::tree

:::download
[この節を終えた状態をダウンロード](./project.zip)
:::

:::faq

### `'200'` を `200` と書いてはいけない？

YAML では `200` は数値になります。OpenAPI では応答のキーは文字列なので、`'200'` と引用符で囲みます。

### YAML の字下げを間違えた

スペース 2 つでそろえ、タブは使いません。次の節で入れる VS Code の拡張機能が、間違いを教えてくれます。

:::
