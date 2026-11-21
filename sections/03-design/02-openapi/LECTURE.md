---
docs: true
title: OpenAPI の準備
---

# OpenAPI の準備

![03 章 OpenAPI の準備](./images/00-thumbnail.svg)

操作をまだ 1 つも書いていない、空の `openapi.yaml` を作ります。`api/` の直下（`package.json` と同じ階層）に置きます。

::diff{file="api/openapi.yaml"}

- `openapi: 3.0.3` … OpenAPI の版です。04 章でリクエストを送る拡張機能の機能（Try it）が 3.0 に対応しているので、3.0 で書きます
- `info` … API の名前と版です
- `servers` … API の URL です。04 章では、ここに書いた `http://localhost:3000` にリクエストを送ります
- `paths` … 操作を書く場所です。次の節から、ここに 1 つずつ書き足します

## プレビューで確かめる

VS Code で `api/openapi.yaml` を開き、エディタの右上のプレビューのボタンを押します。横に API のドキュメントの画面が出ます。`メモ API` と出ていれば大丈夫です。

字下げを間違えたり、決まりに無いキーを書いたりすると、エディタに赤い波線が出て、下の **問題** パネルに説明が出ます。

## 参考にした公式ドキュメント

この節は、次の公式ドキュメントをもとに書いています。

- [OpenAPI Specification v3.0.3](https://spec.openapis.org/oas/v3.0.3.html) … `openapi`・`info`・`servers`・`paths`
- [42Crunch: OpenAPI (Swagger) Editor（README）](https://github.com/42Crunch/vscode-openapi#readme) … プレビュー

## この節を終えたときのディレクトリ

::tree

:::download
[この節を終えた状態をダウンロード](./project.zip)
:::

:::faq

### プレビューのボタンが出ない

拡張機能は、`openapi:` で始まるファイルを OpenAPI のファイルとして扱います。1 行目が `openapi: 3.0.3` になっているか確かめてください。

:::
