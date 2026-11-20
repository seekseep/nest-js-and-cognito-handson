---
docs: true
title: 進め方
sidebar:
  label: 進め方
  order: 0
---

# 進め方

## 1 つのプロジェクトを育てる

このハンズオンでは、02 章で作った NestJS のプロジェクト（`api/`）に、節ごとに機能を足していきます。リポジトリの `sections/<章>/<節>/` には、**その節を終えた時点のプロジェクト** がそのまま入っています。

```text
sections/
├── 02-hello-world/
│   └── 01-nestjs/
│       └── api/        ← 02 章 01 節を終えた時点
├── 03-design/
│   ├── 01-create/
│   │   └── api/        ← 03 章 01 節を終えた時点
│   └── ...
├── 04-implementation/
│   └── ...
```

手元では 1 つのフォルダ（`api/`）を、各節のページの手順どおりに育てていきます。

## ページの読み方

### コードの差分

ファイルを書き換える手順は、前の節との差分で示します。行頭が `+` の行を足し、`-` の行を消します。新しく作るファイルは、すべての行に `+` が付きます。

```diff lang="ts"
 async function bootstrap() {
   const app = await NestFactory.create(AppModule);
+  app.useGlobalPipes(new StandardSchemaValidationPipe());
   await app.listen(process.env.PORT ?? 3000);
 }
```

左の行番号は「書き換える前の行」、右の行番号は「書き換えた後の行」です。

### この節を終えたときのディレクトリ

ページの最後に、その節を終えたときのディレクトリを載せています。前の節から追加・変更したファイルには印が付いています。

その下のボタンから、その節を終えた状態のプロジェクトを ZIP でダウンロードできます。途中の節から始めるときは、ひとつ前の節の ZIP を展開し、`api/` で `npm install` を実行します。

## 前提

- macOS / Windows 10・11（PowerShell 7）/ Linux のどれか
- ターミナルの基本的な操作（`cd`・`ls`）ができる
- JavaScript を書いたことがある

## 使うもの

| 道具 | 役割 | 入れる節 |
|---|---|---|
| Node.js 26（LTS） | NestJS を動かす。SQLite（`node:sqlite`）も入っている | 01 章 |
| VS Code | エディタ | 01 章 |
| OpenAPI (Swagger) Editor | `openapi.yaml` のプレビューと、そこからの動作確認（Try it） | 01 章 |

## 動作確認のしかた

04 章からは、API を `npm run start:dev` で起動したまま、VS Code で `api/openapi.yaml` を開き、各操作（`get:`・`post:` など）の下の行に出る **Try it** からリクエストを送って確かめます。
