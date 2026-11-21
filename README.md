---
docs: true
title: NestJS で作る REST API ハンズオン
---

# NestJS で作る REST API ハンズオン

メモを読み書きする REST API を、**OpenAPI で設計してから** NestJS で実装するハンズオンです。1 つのプロジェクト（`api/`）を、節ごとに少しずつ育てます。

- **設計** — OpenAPI（`openapi.yaml`）。VS Code の拡張機能でプレビューし、そこからリクエストを送って動作確認します
- **API** — NestJS 12（TypeScript）。`openapi.yaml` から作った型と Zod の入力チェックを使います
- **データベース** — Node.js に入っている SQLite（`node:sqlite`）

必要なのは Node.js と VS Code だけです。

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

## 進め方

- 02 章で作る NestJS のプロジェクト（`api/`）を、1 つのフォルダで節ごとに育てます。
- ファイルを書き換える手順は、前の節との差分で示します。行頭が `+` の行を足し、`-` の行を消します。新しく作るファイルは、すべての行に `+` が付きます。見出しが「`ファイル` を作成する／変更する」のところは自分で書く手順で、「`ファイル` が作られる／変わる」のところは、直前のコマンドがした変更です。
- 各節のページの最後に、その節を終えたときのディレクトリと、その状態のプロジェクトの ZIP があります。途中の節から始めるときは、ひとつ前の節の ZIP を展開し、`api/` で `npm install` を実行します。

前提:

- macOS / Windows 10・11（PowerShell 7）/ Linux のどれか
- ターミナルの基本的な操作（`cd`・`ls`）ができる
- JavaScript を書いたことがある

## 関連するハンズオン

NestJS のハンズオンは 3 本に分かれていて、どれから始めても進められます。Cognito と Entra ID のハンズオンも関連しています。つながりは [関連するハンズオン](./sections/RELATED.md) にまとめています。

- NestJS で作る REST API（このハンズオン）
- [NestJS と Cognito で認証と認可](https://github.com/seekseep/nestjs-cognito-auth-handson)
- [NestJS のテスト](https://github.com/seekseep/nestjs-testing-handson)
- [Cognito と Entra ID をローカルで練習する](https://github.com/seekseep/cognito-entra-id-emulation-handson)

## ドキュメントサイト

各節の解説は GitHub Pages で読めます: <https://seekseep.github.io/nestjs-rest-api-handson/>

## ライセンス・注意事項

- 学習用リポジトリです
