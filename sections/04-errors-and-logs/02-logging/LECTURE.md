---
docs: true
title: リクエストのログ
---

# リクエストのログ

![04 章 リクエストのログ](./images/00-thumbnail.svg)

API に届いたリクエストを、ステータスとかかった時間といっしょにログに残す middleware を作ります。

```text
LOG [HTTP] POST /notes 201 5ms
WARN [HTTP] POST /notes 400 1ms
```

## middleware とは

**middleware** は、コントローラーより前に、リクエストごとに呼ばれる関数です。リクエストを見たり、応答に手を加えたりしてから、`next()` で次へ渡します。

## ロギング用の middleware を作る

::diff{file="api/src/common/logging.middleware.ts"}

- `NestMiddleware` … NestJS の middleware が持つ形です。`use(req, res, next)` を書きます
- `new Logger('HTTP')` … NestJS の `Logger` です。`[HTTP]` という見出しを付けて出ます
- `res.on('finish', ...)` … 応答を返し終わったときに呼ばれます。ステータスコードは、このときに決まっています
- ステータスで、ログの重さを変えます。`5xx` は `error`、`4xx` は `warn`、それ以外は `log` です
- 最後の `next()` を忘れると、リクエストがコントローラーに届かず、応答が返らなくなります

## すべてのパスに掛ける

middleware は、モジュールの `configure()` で掛けます。`AppModule` で、すべてのパスに掛けます。

::diff{file="api/src/app.module.ts"}

- `apply(LoggingMiddleware)` … 掛ける middleware
- `forRoutes({ path: '{*splat}', method: RequestMethod.ALL })` … 掛けるパスとメソッド。`'{*splat}'` は「どんなパスでも」です

## 動かす

`npm run start:dev` で起動し、curl でメモを作ったり、決まりに合わない値を送ったりすると、ターミナルに次のように出ます。

```text
[Nest] 63492  - 2026/11/20 15:21:59     LOG [HTTP] POST /notes 201 5ms
[Nest] 63492  - 2026/11/20 15:21:59     LOG [HTTP] GET /notes 200 0ms
[Nest] 63492  - 2026/11/20 15:21:59    WARN [HTTP] POST /notes 400 1ms
[Nest] 63492  - 2026/11/20 15:21:59    WARN [HTTP] GET /nope 404 0ms
```

存在しないパス（`/nope`）は、どのコントローラーにも当たりませんが、middleware は掛かるのでログに残ります。

:::warning
ログに、パスワードやトークン、メモの本文のような中身は書かないでください。
:::

## 参考にした公式ドキュメント

この節は、次の公式ドキュメントをもとに書いています。

- [NestJS: Middleware](https://docs.nestjs.com/middleware) … `NestMiddleware`、`configure()` と `MiddlewareConsumer`、すべてのパスに掛ける `forRoutes`
- [NestJS: Logger](https://docs.nestjs.com/application/logger) … `Logger` の使い方

## この節を終えたときのディレクトリ

::tree

:::download
[この節を終えた状態をダウンロード](./project.zip)
:::
