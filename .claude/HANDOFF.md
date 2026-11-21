# 引き継ぎメモ（2026-11-20 更新）

## 状況

- 2026-11-20: 大きな 1 本（Next.js + NestJS + Cognito + Podman）を 3 本に分けた。このリポジトリは A「NestJS で作る REST API」（#34）
  - B「Cognito で認証と認可」… seekseep/nestjs-cognito-auth-handson
  - C「テスト」… seekseep/nestjs-testing-handson
  - どれも他を前提にしない（知識としては関係する）
- リポジトリ名を nest-js-and-cognito-handson から nestjs-rest-api-handson に変えた。サイトは https://seekseep.github.io/nestjs-rest-api-handson/
- 分ける前の教材（Next.js・Podman・Cognito・テストの章）は、#34 より前の main の履歴にある
- 2026-11-20: 「OpenAPI で設計 → 実装 → 整理」の構成に作り直した（デコレーター・curl/Postman・エラーとログ・HTML の章は消した）

## 環境

- Node.js 26（nvm。シェルによっては 24 が先に出るので `nvm use 26`）、pnpm は `site/package.json` の packageManager に従う

## 章と節

| 章 | 節 |
|---|---|
| 01-setup | 01-nodejs（本文だけ。Node.js 26・VS Code・42Crunch の OpenAPI (Swagger) Editor。Windows は PowerShell 7） |
| 02-hello-world | 01-nestjs（`nest new --skip-tests --no-observe` と、使わないファイルを消す手順） |
| 03-design | 01-crud（本文だけ）・02-openapi・03-create・04-get・05-list・06-update・07-delete・08-components（`openapi.yaml` だけが変わる） |
| 04-implementation | 01-sqlite・02-types（@hey-api/openapi-ts で型を作る）・03-create・04-get・05-list・06-update・07-delete（コントローラーに直接書く。入力チェックなし）・08-validation（Zod で入力チェック） |
| 05-refactor | 01-database-provider・02-dto・03-entities・04-service・05-module |

## 決まっている設計

- プロジェクトは NestJS 1 つだけ（`sections/<章>/<節>/api/`）。Podman・compose・コンテナは使わない
- 次の節は `tools/copy-lecture.sh <前の節> <次の節>` でコピーしてから差分を足す。サムネイルは `tools/thumbnail.mjs`
- `openapi.yaml` は 3.0.3（42Crunch の Try it の CodeLens が 2.0 / 3.0.x だけに出るため。`src/tryit/lens.ts` と `src/parsers.ts`）。
  `servers` は `http://localhost:3000`。400・404 は本文の形を書かない（NestJS の既定のエラー）
- 動作確認は Try it。拡張機能の中で `got` で送るので CORS は不要（`src/webapps/http-handler.ts`）
- SQLite は `node:sqlite` の `DatabaseSync`（Node.js 26 では `Database` に改名され、`DatabaseSync` は文書だけの非推奨の別名。
  `@types/node` 26 にまだ `Database` が無いので `DatabaseSync` を使う）。`api/notes.db`、`STRICT` テーブル、列名は `Note` の項目名と同じ
- 型は 04-02 で openapi-typescript（`overrides: { "openapi-typescript": { "typescript": "$typescript" } }`、`--default-non-nullable false`、出力は `src/api/schema.d.ts`）
- 入力チェックは Zod + `StandardSchemaValidationPipe`（`@Body({ schema })`）。スキーマは `satisfies z.ZodType<unknown, CreateNoteInput>` で生成した型と照らす
- 05 章: 01 で `{ provide: DatabaseSync, useFactory: openDatabase }`、02 で `dto/`、03 で `entities/`、04 で `NotesService`、05 で `NotesModule`

## 確かめ方のメモ

- 各節の `api/` で `npm install` → `npm run build`。04・05 章は Node.js 26 で起動して、各操作を curl で叩き（200・201・204・400・404）、再起動してもデータが残ることを確かめた
- `openapi.yaml` に必須の項目を足して `npm run generate:api` → `npm run build` がエラーになることを確かめた
- Try it・プレビューの GUI の操作は、手元の VS Code で確かめる必要がある
