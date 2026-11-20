---
docs: true
title: Delete を設計する
---

# Delete を設計する

![03 章 Delete を設計する](./images/00-thumbnail.svg)

メモを消す操作（Delete）を書き足します。

| メソッド | パス | 中身 |
|---|---|---|
| `DELETE` | `/notes/{id}` | 消す。本文の無い `204` を返す |

::diff{file="api/openapi.yaml"}

- `204 No Content` は本文の無い応答なので、`content` を書きません

## プレビューで確かめる

VS Code で `api/openapi.yaml` を開き、エディタの右上のプレビューのボタンを押します。横に API のドキュメントの画面が出ます。 5 つの操作（`GET /notes`・`POST /notes`・`GET`・`PATCH`・`DELETE /notes/{id}`）がそろっていれば大丈夫です。

## 参考にした公式ドキュメント

この節は、次の公式ドキュメントをもとに書いています。

- [OpenAPI Specification v3.0.3](https://spec.openapis.org/oas/v3.0.3.html) … Responses Object

## この節を終えたときのディレクトリ

::tree

:::download
[この節を終えた状態をダウンロード](./project.zip)
:::
