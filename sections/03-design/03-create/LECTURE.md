---
docs: true
title: 作成の設計
---

# 作成の設計

![03 章 作成の設計](./images/00-thumbnail.svg)

メモを作る操作（Create）を書き足します。

| メソッド | パス | 中身 |
|---|---|---|
| `POST` | `/notes` | 本文（JSON）からメモを作り、`201` で返す |

::diff{file="api/openapi.yaml"}

- `paths` → `/notes` → `post` … `POST /notes` の操作です
- `requestBody` … 送る本文の形です。`required` に書いた `title` は必ず送り、`body` は省略すると `''` になります。`additionalProperties: false` は、ほかの項目を受け付けないという意味です
- `id` は送る本文に書きません。ID はサーバーが作ります。`additionalProperties: false` があるので、`id` を送っても受け付けません
- `responses` … ステータスコードごとの応答です。キーは `'201'` のように文字列で書きます。`400` は入力が決まりに合わないときです

:::notice[200 ではなく 201 を返す理由]
`200 OK` は「うまくいった」だけを表します。`201 Created` は「うまくいって、新しいものができた」ことまで表します。作る操作では、受け取った側が「メモができた」と分かるように `201` を返します。
:::

:::notice[Location ヘッダー]
`201` の応答には、できたものの URL を `Location` ヘッダーで添えられます（例: `Location: /notes/1b9d6bcd-...`）。受け取った側は、この URL でできたメモを読みに行けます。このハンズオンでは、できたメモを本文で返すので `Location` は付けません。
:::

## プレビューで確かめる

VS Code で `api/openapi.yaml` を開き、エディタの右上のプレビューのボタンを押します。横に API のドキュメントの画面が出ます。 `POST /notes` が出て、送る本文と返るメモの形が見えれば大丈夫です。

## 参考にした公式ドキュメント

この節は、次の公式ドキュメントをもとに書いています。

- [OpenAPI Specification v3.0.3](https://spec.openapis.org/oas/v3.0.3.html) … Operation Object・Request Body Object・Responses Object
- [RFC 9110: 201 Created](https://www.rfc-editor.org/rfc/rfc9110.html#status.201) … `201` の意味
- [RFC 9110: Location](https://www.rfc-editor.org/rfc/rfc9110.html#field.location) … `201` の応答の `Location` が指すもの
- [42Crunch: OpenAPI (Swagger) Editor（README）](https://github.com/42Crunch/vscode-openapi#readme) … プレビュー

## この節を終えたときのディレクトリ

::tree

:::download
[この節を終えた状態をダウンロード](./project.zip)
:::
