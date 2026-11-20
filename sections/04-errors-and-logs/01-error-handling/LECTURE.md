---
docs: true
title: エラーの形をそろえる
---

# エラーの形をそろえる

![04 章 エラーの形をそろえる](./images/00-thumbnail.svg)

前の章までで、API のエラーは NestJS の既定の形で返っていました。

```json
{"message":["title: Too small: expected string to have >=1 characters"],"error":"Bad Request","statusCode":400}
{"message":"Note c126ae93-... not found","error":"Not Found","statusCode":404}
```

`message` が、入力チェックのときは配列、それ以外は文字列で、呼ぶ側が見分ける必要があります。

この節では **ExceptionFilter** で、すべてのエラーを 1 つの形にそろえます。

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "messages": ["title: Too small: expected string to have >=1 characters"],
  "path": "/notes",
  "timestamp": "2026-11-20T06:21:59.791Z"
}
```

- `messages` は、いつも文字列の配列
- どのパスで、いつ起きたか（`path`・`timestamp`）も入れる
- 思いがけない例外（`500`）では、中身を返さない

## ExceptionFilter を作る

NestJS では、処理の途中で投げられた例外を **ExceptionFilter** が受け取って、応答を作ります。`@Catch()` に何も渡さないと、すべての例外を受け取ります。

::diff{file="api/src/common/all-exceptions.filter.ts"}

- `ErrorBody` … この API が返すエラーの形を TypeScript の型で書いています。項目を入れ忘れるとコンパイルエラーになります
- `HttpException`（`BadRequestException`・`NotFoundException` など）なら、そのステータスを使います。それ以外の例外は `500` にします
- `error` は、Node.js の `STATUS_CODES`（`400` なら `Bad Request`）から作ります
- `toMessages` は、例外の中身から説明を取り出し、いつも配列にします。入力チェックの例外の中身は `{ message: string[] }`、`NotFoundException('...')` の中身は `{ message: string }` です
- `500` のときは、利用者には `Internal server error` とだけ返し、例外の中身（スタックトレース）はログに出します。見せてはいけない情報が入ることがあるからです
- `httpAdapter.reply` で応答を返します

## アプリ全体に登録する

`APP_FILTER` で、アプリ全体に登録します。

::diff{file="api/src/app.module.ts"}

`APP_FILTER` で登録すると filter も NestJS が作るので、コンストラクターで `HttpAdapterHost` を受け取れます。

## 動かす

`npm run start:dev` で起動し、入力チェックに合わない値を送ります。

:::::platform
::::macos-linux
```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"title":""}'
```
::::
::::windows
```powershell
curl -X POST http://localhost:3000/notes `
  -H "Content-Type: application/json" `
  -d '{"title":""}'
```
::::
:::::

```json
{"statusCode":400,"error":"Bad Request","messages":["title: Too small: expected string to have >=1 characters"],"path":"/notes","timestamp":"2026-11-20T06:21:59.791Z"}
```

存在しないメモや、存在しないパスも、同じ形になります。

```bash
curl http://localhost:3000/notes/3b698a13-ddf5-40ec-8ec6-720004f0e9cd
curl http://localhost:3000/nope
```

```json
{"statusCode":404,"error":"Not Found","messages":["Note 3b698a13-ddf5-40ec-8ec6-720004f0e9cd not found"],"path":"/notes/3b698a13-ddf5-40ec-8ec6-720004f0e9cd","timestamp":"..."}
{"statusCode":404,"error":"Not Found","messages":["Cannot GET /nope"],"path":"/nope","timestamp":"..."}
```

## 参考にした公式ドキュメント

この節は、次の公式ドキュメントをもとに書いています。

- [NestJS: Exception filters](https://docs.nestjs.com/exception-filters) … `@Catch()` ですべての例外を受け取る filter、`HttpAdapterHost` と `httpAdapter.reply`、`APP_FILTER` での登録
- [Node.js: http.STATUS_CODES](https://nodejs.org/api/http.html#httpstatus_codes) … ステータスコードから名前を引く

## この節を終えたときのディレクトリ

::tree

:::download
[この節を終えた状態をダウンロード](./project.zip)
:::
