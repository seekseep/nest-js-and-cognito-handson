---
docs: true
title: 開発ツール（VS Code / ブラウザ）
sidebar:
  label: 開発ツール
  order: 3
---

# 開発ツール（VS Code / ブラウザ）

ハンズオンを進めるうえで使うエディタとブラウザについてまとめます。入れ方は [Node.js と VS Code を入れる](./01-setup/01-nodejs/LECTURE.md) の節にあります。

## VS Code

### プロジェクトを開く

育てているプロジェクトのフォルダ（`api/`）で次を実行するか、VS Code の **ファイル → フォルダーを開く** から開きます。

```bash
code .
```

06 章の拡張機能の設定（`.vscode/extensions.json`・`redocly.yaml`）は、開いたフォルダの直下にあるときに読まれます。`api/` を開いてください。

### ターミナルを開く

`` Ctrl + ` ``（バッククォート）でエディタの中にターミナルが開きます。API を動かしたまま curl で呼ぶときは、ターミナルを 2 つ開いて（右上の **＋**）使い分けます。

### 入れておくと便利な拡張機能

| 拡張機能 | 用途 |
|---|---|
| Prettier | NestJS のプロジェクトに入っている Prettier で整形する |
| oxc | NestJS のプロジェクトに入っている oxlint の指摘をエディタに出す |

OpenAPI 用の拡張機能は [06 章](./06-openapi/02-extensions/LECTURE.md) で紹介します。

## ブラウザの開発者ツール

05 章で HTML の画面から API を呼ぶときは、ブラウザの開発者ツール（DevTools）を使います。Chrome / Edge / Firefox のどれでも `F12` か、右クリック → 「検証」で開けます。

- **Network タブ** — API へのリクエストとレスポンス、ステータスコードを確かめる
- **Console タブ** — エラーやログを確かめる
