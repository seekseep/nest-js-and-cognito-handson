---
docs: true
title: NestJS で作る REST API ハンズオン
---

# NestJS で作る REST API ハンズオン

メモを読み書きする REST API を、**OpenAPI で設計してから** NestJS で実装するハンズオンです。1 つのプロジェクト（`api/`）を、節ごとに少しずつ育てます。

- **設計** — OpenAPI（`openapi.yaml`）。VS Code の拡張機能でプレビューし、そこからリクエストを送って動作確認します
- **API** — NestJS 12（TypeScript）。`openapi.yaml` から作った型と Zod の入力チェックを使います
- **データベース** — Node.js に入っている SQLite（`node:sqlite`）

必要なのは Node.js と VS Code だけです。各節のページの最後で、その節を終えた状態のプロジェクトを ZIP でダウンロードできます。詳しくは [進め方](./sections/README.md) を見てください。

## このハンズオンで作るもの

### 01. 準備

Node.js 26 と VS Code、OpenAPI の拡張機能を入れます。

### 02. Hello World

NestJS のプロジェクトを作り、`GET /` で「Hello World!」を返します。

### 03. 設計する

メモの API の約束を `openapi.yaml` に書きます。Create・Get・List・Update・Delete を 1 節に 1 つずつ書き足し、最後に共通部分を `components` にまとめます。

### 04. 実装する

SQLite を用意し、`openapi.yaml` のとおりに 5 つの操作を 1 節に 1 つずつ実装します。まずはコントローラーに直接書き、VS Code で `openapi.yaml` からリクエストを送って動作確認します。

### 05. 整理する

動きを変えずに、データベースのプロバイダー・`dto/`・`entities/`・サービス・モジュールの順に、NestJS の標準の形に分けます。

## 関連するハンズオン

次の 2 つと合わせて 1 つのシリーズです。どれから始めても進められます。

- [NestJS と Cognito で認証と認可](https://github.com/seekseep/nestjs-cognito-auth-handson)
- [NestJS のテスト](https://github.com/seekseep/nestjs-testing-handson)

## ドキュメントサイト

各節の解説は GitHub Pages で読めます: <https://seekseep.github.io/nestjs-rest-api-handson/>

## ライセンス・注意事項

- 学習用リポジトリです
