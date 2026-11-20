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
│   ├── 01-nestjs/
│   │   └── api/        ← 02 章 01 節を終えた時点
│   └── 03-curl-postman/
│       └── api/        ← 02 章 03 節を終えた時点
├── 03-rest-api/
│   └── ...
```

手元では 1 つのフォルダ（たとえば `~/handson/api/`）を育てていきます。各節のページの手順どおりにファイルを足したり書き換えたりしてください。

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

ページの最後に、その節を終えたときのディレクトリを載せています。前の節から **追加したファイル** と **変更したファイル** には印が付いています。手元のディレクトリと見比べてください。

その下のボタンから、その節を終えた状態のプロジェクトを ZIP でダウンロードできます。

- 途中の節から始めたいときは、ひとつ前の節の ZIP をダウンロードして展開してください
- 展開したら、`api/` で `npm install` を実行します（`node_modules/` は ZIP に入っていません）

## 前提

- macOS / Windows 10・11（PowerShell 7）/ Linux のどれか。Windows に必要なスペックは [Node.js と VS Code を入れる](./01-setup/01-nodejs/LECTURE.md) の節にあります
- ターミナルの基本的な操作（`cd`・`ls`）ができる
- JavaScript を書いたことがある。TypeScript は書きながら覚えれば大丈夫です

## 使うもの

| 道具 | 役割 | 入れる節 |
|---|---|---|
| Node.js 26（LTS） | NestJS を動かす | 01 章 |
| VS Code | エディタ。OpenAPI の拡張機能も使う | 01 章 |
| curl / Postman | API を呼び出して確かめる | 02 章 |
| ブラウザ | HTML の画面から API を呼ぶ | 05 章 |
