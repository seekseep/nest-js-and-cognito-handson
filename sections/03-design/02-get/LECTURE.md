---
docs: true
title: Get を設計する
---

# Get を設計する

![03 章 Get を設計する](./images/00-thumbnail.svg)

メモを 1 件返す操作（Get）を書き足します。

| メソッド | パス | 中身 |
|---|---|---|
| `GET` | `/notes/{id}` | メモを 1 件返す。無ければ `404` |

::diff{file="api/openapi.yaml"}

- `/notes/{id}` の `{id}` は、パスの中の値です。`parameters` で、`id` がパス（`in: path`）の値で、UUID の形の文字列であることを書きます
- 応答のメモの形は、前の節の `201` と同じものをもう一度書いています。同じ形をまとめるのは、この章の最後の節です
- `400` は ID が UUID の形でないとき、`404` はメモが無いときです

## プレビューで確かめる

VS Code で `api/openapi.yaml` を開き、エディタの右上のプレビューのボタンを押します。横に API のドキュメントの画面が出ます。 `GET /notes/{id}` が増え、`id` のパラメーターと `200`・`400`・`404` の応答が見えれば大丈夫です。

## 参考にした公式ドキュメント

この節は、次の公式ドキュメントをもとに書いています。

- [OpenAPI Specification v3.0.3](https://spec.openapis.org/oas/v3.0.3.html) … Path Item・Parameter Object

## この節を終えたときのディレクトリ

::tree

:::download
[この節を終えた状態をダウンロード](./project.zip)
:::
