---
docs: true
title: List を設計する
---

# List を設計する

![03 章 List を設計する](./images/00-thumbnail.svg)

メモの一覧を返す操作（List）を書き足します。

| メソッド | パス | 中身 |
|---|---|---|
| `GET` | `/notes` | メモの一覧を返す |

::diff{file="api/openapi.yaml"}

- `/notes` に `get` を足します。同じパスに、メソッドごとの操作を並べて書きます
- 一覧なので、応答は `type: array` で、`items` に 1 件の形を書きます

## プレビューで確かめる

VS Code で `api/openapi.yaml` を開き、エディタの右上のプレビューのボタンを押します。横に API のドキュメントの画面が出ます。 `GET /notes` が増え、応答がメモの配列になっていれば大丈夫です。

## 参考にした公式ドキュメント

この節は、次の公式ドキュメントをもとに書いています。

- [OpenAPI Specification v3.0.3](https://spec.openapis.org/oas/v3.0.3.html) … Schema Object の `type: array` と `items`

## この節を終えたときのディレクトリ

::tree

:::download
[この節を終えた状態をダウンロード](./project.zip)
:::
