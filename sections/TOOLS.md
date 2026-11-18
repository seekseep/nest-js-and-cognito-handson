---
docs: true
title: 開発ツール（VS Code / ブラウザ）
sidebar:
  label: 開発ツール
  order: 3
---

# 開発ツール（VS Code / ブラウザ）

ハンズオンを進めるうえで使うエディタとブラウザについてまとめます。

## VS Code

エディタには [Visual Studio Code](https://code.visualstudio.com/) を使います。コードの編集と同じウィンドウでターミナルを使えるので、起動コマンドの実行とコードの確認を行き来しやすくなります。

### インストール

公式サイトからインストーラーをダウンロードするか、Homebrew で入れます。

```bash
# macOS（Homebrew を使う場合）
brew install --cask visual-studio-code
```

### プロジェクトを開く

育てているプロジェクトのフォルダで次を実行するか、VS Code の **ファイル → フォルダーを開く** から開きます。

```bash
code .
```

### ターミナルを開く

`` Ctrl + ` ``（バッククォート）でエディタの中にターミナルが開きます。フロントエンドと BFF を同時に動かす節では、ターミナルを 2 つ開いて（右上の **＋**）使い分けます。

### 入れておくと便利な拡張機能

| 拡張機能 | 用途 |
|---|---|
| ESLint | Next.js と NestJS のプロジェクトに入っている ESLint の指摘をエディタに出す |
| Prettier | NestJS のプロジェクトに入っている Prettier で整形する |
| Podman / Docker 系の拡張 | `Containerfile` と `compose.yaml` の補完 |

OpenAPI 用の拡張機能は [07 章](./07-openapi/02-extensions/LECTURE.md) で紹介します。

## ブラウザの開発者ツール

アプリの動きを確かめるときは、ブラウザの開発者ツール（DevTools）を使います。Chrome / Edge / Firefox のどれでも `F12` か、右クリック → 「検証」で開けます。

- **Network タブ** — BFF へのリクエストとレスポンス、ステータスコード、`Authorization` ヘッダーを確かめる
- **Console タブ** — エラーやログを確かめる
- **Application タブ**（Chrome）— Amplify が保存したトークン（Local Storage）を確かめる
