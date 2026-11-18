# 引き継ぎメモ（2026-11-18 更新）

## 状況

- 01〜09 章をすべてマージ済み（#2〜#4、#16〜#18、#20〜#23）。GitHub Pages へのデプロイも成功している
- 残りは #19「本物の Cognito での手元確認」だけ。AWS の認証情報が無い環境で作ったので、05・06・08・09 章の Cognito を使う部分は実物で試していない
  - 代わりに、手元で作った RSA 鍵で Cognito と同じ形のアクセストークンに署名し、`aws-jwt-verify` の `cacheJwks` に公開鍵を入れて、Guard・認可・middleware を HTTP 越しに確かめた（各 PR の本文を参照）

## 環境

- Node.js 26（nvm。default を 26 にした）、pnpm は `site/package.json` の packageManager（11.21.0）に従う
- Podman 6.2（macOS、libkrun の Podman マシン）、compose のプロバイダは docker-compose 5.8
- `PODMAN_COMPOSE_WARNING_LOGS=false` で `podman compose` のお知らせを消せる

## 作っていて分かったこと（本文にも書いてある）

- compose の `build` は `dockerfile: Containerfile` を明示する（既定は Dockerfile）
- ファイルの反映はバインドマウントではなく `develop.watch`（sync / rebuild）。`podman compose up --build --watch`。ファイルの削除は同期されない
- `node:26-slim` には `ps` が無く、`nest start --watch` が古いプロセスを止められず EADDRINUSE になる。bff の Containerfile で `procps` を入れる
- `.env.local` / `bff/.env` はイメージに入れず（`.containerignore`）、compose の `env_file`（`required: false`）で渡す
- `nest new --skip-git` の bff には `.gitignore` が無いので、06-01 から `bff/.gitignore` を置いている
- Zod の `createNoteSchema.partial()` は `default('')` が残るので、更新用のスキーマは別に書く
- openapi-typescript 7.13 は `typescript ^5` 前提。bff（TypeScript 6）には入れず、`my-app/` 直下の `package.json` にまとめた。`redocly.yaml` の `x-openapi-ts` は `output` しか読まれないので、`--default-non-nullable false` はコマンドに書く
- `satisfies z.ZodType<unknown, Api>` は一方向なので、`Expect<Equal<z.input<...>, Api>>` も併用している
- `my-app/package-lock.json` があると Next.js がルートを取り違えるので、`next.config.ts` に `turbopack.root`。ルートを変えたら `.next` を消す
- middleware は Guard より先に動く。middleware の例外を拾えるのはグローバルの ExceptionFilter（`APP_FILTER`）だけ

## 決まっている設計

- 各節のディレクトリ = その節を終えた時点のプロジェクト（`frontend/` = Next.js、`bff/` = NestJS。
  03 章から `compose.yaml` と各 `Containerfile`）
- 次の節は `tools/copy-lecture.sh <前の節> <次の節>` でコピーしてから差分を足す。
  サムネイルは `tools/thumbnail.mjs` の THUMBNAILS に足して `node tools/thumbnail.mjs`
- 本文: 変更は `::diff{file="..."}`（前の節との差分を自動生成。新規ファイルは全行 `+`）。
  前の節が無い・生成直後との差分を見せたいときだけ `:::code{filepath=... offset=... newOffset=...}` を手で書く。
  末尾は「この節を終えたときのディレクトリ」→ `::tree` → `:::download` + `[...](./project.zip)`、最後に `:::faq`
- Next.js 16: `output: "export"`。create-next-app が入れる `cacheComponents` / `partialPrefetching` は
  export と両立しない（`PPR cannot be enabled in export mode`）ので外す。
  `frontend/.gitignore` は `.env*` を無視するので、05 章で `!.env.example` を足す
- NestJS 12: ESM（import の末尾は `.js`）、Vitest、oxlint。`nest new bff --package-manager npm --skip-git`。
  ポートは BFF 3001・frontend 3000。生成された `AppController` の `GET /` は残す（spec が通るように）
- 03 章: Podman マシン（macOS）、compose プロバイダは docker-compose。node:26-slim。ファイル変更の反映（watch）を確かめる
- 04 章: メモ API（メモリ上に保持）。入力チェックは Zod + NestJS 12 の `StandardSchemaValidationPipe`
  （`@Body({ schema })`）。03 節で Next.js（クライアントコンポーネント）から fetch するので CORS を有効にする
- 05 章: Cognito のユーザープールとアプリクライアントの作り方（コンソール）。aws-amplify v6 +
  @aws-amplify/ui-react の Authenticator。ID は `.env.example` にプレースホルダだけ
- 06 章: 自作の Guard + aws-jwt-verify でアクセストークンを検証（認証）。認可は `cognito:groups` の admin と、
  メモの持ち主（`sub`）。`@nestjs/authentication`（JwtBearerProvider、jwks + `audience: false`）はコラムで紹介
- 07 章: `openapi.yaml` を手で書く（設計が先）。VS Code の拡張機能、openapi-typescript で型を生成
- 08 章: 生成した型を BFF（Zod スキーマに `satisfies`）と frontend（openapi-fetch）で使う
- 09 章: APP_GUARD + `@Public()` でアプリ全体、middleware の `forRoutes` でパス単位、ExceptionFilter で
  エラーの形をそろえる、ロギング用 middleware
- 本物の Cognito で確認できない環境では、ビルドと「トークン無しなら 401」までを確かめ、
  残りは PR に「手元で確認が必要」と書く
- S3 は章を作らず、02-01 のコラムで `aws s3 sync out/` を紹介する（イシュー #1）

## 確かめ方のメモ

- サイトの見た目: `site/dist` をベースパス付きで配って、Playwright（playwright-core + 手元の Chrome）で要素のスクリーンショットを撮った
