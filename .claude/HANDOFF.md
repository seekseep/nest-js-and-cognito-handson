# 引き継ぎメモ（2026-11-20 更新）

## 状況

- 2026-11-20: 大きな 1 本（Next.js + NestJS + Cognito + Podman）を 3 本に分けた。このリポジトリは A「NestJS で作る REST API」（#34）
  - B「Cognito で認証と認可」… seekseep/nestjs-cognito-auth-handson
  - C「テスト」… seekseep/nestjs-testing-handson
  - どれも他を前提にしない（知識としては関係する）
- リポジトリ名を nest-js-and-cognito-handson から nestjs-rest-api-handson に変えた。サイトは https://seekseep.github.io/nestjs-rest-api-handson/
- 分ける前の教材（Next.js・Podman・Cognito・テストの章）は、#34 より前の main の履歴にある

## 環境

- Node.js 26（nvm。シェルによっては 24 が先に出るので `nvm use 26`）、pnpm は `site/package.json` の packageManager に従う

## 章と節

| 章 | 節 |
|---|---|
| 01-setup | 01-nodejs（本文だけ。Node.js 26 と VS Code。Windows は PowerShell 7） |
| 02-hello-world | 01-nestjs・02-decorators（本文だけ）・03-curl-postman |
| 03-rest-api | 01-notes-api・02-crud-validation |
| 04-errors-and-logs | 01-error-handling・02-logging |
| 05-html | 01-call-from-html |
| 06-openapi | 01-writing・02-extensions・03-type-generation・04-use-types |

## 決まっている設計

- プロジェクトは NestJS 1 つだけ（`sections/<章>/<節>/api/`）。Podman・compose・Next.js は使わない
- `npx @nestjs/cli@12 new api --package-manager npm`（`--skip-git` を付けないので `api/.gitignore` がある）。ポートは既定の 3000
- 次の節は `tools/copy-lecture.sh <前の節> <次の節>` でコピーしてから差分を足す。サムネイルは `tools/thumbnail.mjs`
- ファイル名は NestJS の標準: `notes/dto/create-note.dto.ts`・`update-note.dto.ts`、`notes/entities/note.entity.ts`。
  型は `CreateNoteDto`・`UpdateNoteDto`・`Note`。`noteIdSchema` はコントローラーの中
- 入力チェックは Zod + `StandardSchemaValidationPipe`（`@Body({ schema })`）。更新用のスキーマは `partial()` を使わず別に書く（`default('')` が残るため）
- 04-01: `AllExceptionsFilter`（`APP_FILTER`）。エラーの形 `ErrorBody`（`statusCode, error, messages, path, timestamp`）は手で書き、06-04 で生成した型に置き換える
- 04-02: `LoggingMiddleware`（`forRoutes({ path: '{*splat}', method: RequestMethod.ALL })`）。ユーザーは出さない
- 05-01: `app.useStaticAssets(join(import.meta.dirname, '..', 'public'))`（`NestExpressApplication`）。`AppController` の `GET /` を消し、あいさつは `AppService.getGreeting()` に移した。spec と e2e-spec も `/greeting` に。同じオリジンなので CORS は不要（コラムだけ）
- 06 章: `api/openapi.yaml`・`api/redocly.yaml`・`api/.vscode/extensions.json`。認証（security・/me・/admin）は載せない。
  Redocly の `security-defined`・`operation-4xx-response` は切っている
- openapi-typescript 7.13 は `typescript@^5` を peer に持つ。API は TypeScript 6 なので、`api/package.json` の
  `overrides: { "openapi-typescript": { "typescript": "$typescript" } }` で入れる。出力は `src/api/schema.d.ts`（`--default-non-nullable false`）
- 06-04: `Note`・`ErrorBody` を生成した型に。Zod のスキーマは `satisfies z.ZodType<unknown, ...>` と `Expect<Equal<z.input<...>, ...>>` で照らし合わせる

## 確かめ方のメモ

- 各節の `api/` で `npm install` → `npm run build`・`npm run lint`・`npm test`・`npm run test:e2e`。06 章は `npm run lint:api`・`npm run check:api`
- 05 章の画面のスクリーンショットは Playwright（playwright-core + 手元の chromium）で撮った
- サイトの見た目: `site/dist` をベースパス付きで配って、Playwright で要素のスクリーンショットを撮った
