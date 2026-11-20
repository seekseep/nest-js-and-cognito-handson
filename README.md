---
docs: true
title: NestJS で作る REST API ハンズオン
---

# NestJS で作る REST API ハンズオン

NestJS で、メモを読み書きする REST API を作るハンズオンです。**1 つのプロジェクトを少しずつ育てながら**、入力チェック・エラーの形・ログ・HTML の画面からの呼び出し・OpenAPI までを進めます。

- **API** — NestJS 12（TypeScript）。メモはメモリ上に持つので、データベースは要りません
- **入力チェック** — Zod と NestJS の `StandardSchemaValidationPipe`
- **画面** — HTML 1 枚。NestJS から配り、`fetch` で API を呼びます
- **API の約束** — OpenAPI。Redocly で確かめ、openapi-typescript で型を作ります

必要なのは Node.js と VS Code だけです。コンテナや、クラウドのアカウントは使いません。

## 進め方

各節のページは「その節でやること → 手順（コードの差分）→ 動かして確かめる → この節を終えたときのディレクトリ」の順に並んでいます。ページの最後には、その節を終えた状態のプロジェクトを ZIP でダウンロードできるボタンがあります。途中の節から始めたいときや、手元のコードと見比べたいときに使ってください。

詳しくは [進め方](./sections/README.md) を見てください。

## このハンズオンで作るもの

### 01. 環境構築

Node.js 26 と VS Code を入れます。Node.js は 26 が使えれば、公式サイトのインストーラーでもバージョン管理ツール（nvm など）でもかまいません。

### 02. Hello World

NestJS のプロジェクトを作り、「Hello World」を返します。NestJS で使う `@Controller()` のようなデコレーターが、TypeScript の標準ではなく NestJS が前提にしている書き方であることも押さえます。API は curl と Postman で呼び出します。

### 03. REST API

メモの API（一覧・1 件の取得・作成・更新・削除）を作り、Zod で入力チェックを入れます。ファイルは NestJS の決まり（`dto/`・`entities/`）に合わせて置きます。

### 04. エラーとログ

ExceptionFilter で、すべてのエラーを 1 つの形にそろえます。middleware で、リクエストごとにログを出します。

### 05. HTML から呼ぶ

HTML 1 枚の画面を NestJS から配り、`fetch` でメモの一覧・追加・削除をします。

### 06. OpenAPI

API の約束を OpenAPI（YAML）で書きます。VS Code の拡張機能と Redocly で確かめ、openapi-typescript で型を作り、その型を API のコードで使います。

## 関連するハンズオン

このハンズオンは、次の 2 つと合わせて 1 つのシリーズになっています。どれから始めても進められます。

- [NestJS と Cognito で認証と認可](https://github.com/seekseep/nestjs-cognito-auth-handson)
- [NestJS のテスト](https://github.com/seekseep/nestjs-testing-handson)

## ドキュメントサイト

各節の解説は GitHub Pages で読めます: <https://seekseep.github.io/nestjs-rest-api-handson/>

## ライセンス・注意事項

- 学習用リポジトリです
