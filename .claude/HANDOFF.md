# 引き継ぎメモ（2026-11-18）

## 状況

- マージ済み: サイトの骨格（#2）、01 章 基本的な環境構築（#3）
- draft PR #4（ブランチ `chapter-02-hello-world`）: 02 章 Hello World。コードと本文は書き終えている
  - 残り 1: `::tree` のコードブロックに Expressive Code の枠・色（ins / mark）が当たらない。
    生成 HTML には `.expressive-code` と `ins` クラスが出ている。同じページの他のコードブロックも、
    計算済みスタイルを測ると背景が透明だったので、測り方が悪かった可能性もある。原因は未特定
  - 残り 2: トップの README.md「このハンズオンで作るもの」の上に構成図
    `sections/02-hello-world/01-nextjs/images/01-architecture.svg` を戻す（02 章が入るまで外していた）
- 03〜09 章は未着手

## 最初にやること（環境構築）

1. 道具: Node.js 26 LTS（nvm）、npm、pnpm 11（`site/package.json` の packageManager に合わせる）、gh（認証済みか）、
   Podman 6 と compose（`podman compose version`。入れられない環境なら「使えない」と報告する）
2. 確認: `cd site && pnpm install && pnpm run build` が通る。02 章の各節で
   `frontend` の `npm install && npm run build`、`bff` の `npm install && npm run build && npm test` が通る
3. 残りの作業を 1 件ずつイシューにして、#1 のチェックリストからリンクする
   （02 章の残り、03〜09 章を 1 章 1 イシュー。下の設計を各イシューに書く）

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
