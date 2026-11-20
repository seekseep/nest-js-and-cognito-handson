---
docs: true
title: 開発ツール（VS Code）
sidebar:
  label: 開発ツール
  order: 3
---

# 開発ツール（VS Code）

入れ方は [Node.js と VS Code を入れる](./01-setup/01-nodejs/LECTURE.md) の節にあります。

## プロジェクトを開く

育てているプロジェクトのフォルダ（`api/`）で `code .` を実行して開きます。`` Ctrl + ` ``（バッククォート）でエディタの中にターミナルが開くので、そこで `npm run start:dev` を動かします。

## OpenAPI (Swagger) Editor

`api/openapi.yaml` を開くと使えます。

- **プレビュー** … エディタの右上のプレビューのボタンで、API のドキュメントの画面が横に出ます
- **間違いの表示** … 書き間違いは、赤い波線と **問題** パネルに出ます
- **Try it** … 各操作（`get:`・`post:` など）の下の行に出ます。押すと、`servers` の URL（`http://localhost:3000`）にリクエストを送り、応答を表示します
