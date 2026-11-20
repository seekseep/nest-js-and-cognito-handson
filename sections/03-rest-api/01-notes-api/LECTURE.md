---
docs: true
title: メモ API をつくる
---

# メモ API をつくる

![03 章 メモ API をつくる](./images/00-thumbnail.svg)

この章では、**メモ** を読み書きする REST API を作ります。この節では、メモの一覧と作成の 2 つを作ります。メモはデータベースではなく、API のメモリ上（配列）に持つので、API を再起動すると消えます。

## REST API とは

**REST API** は、URL で「何を」（リソース）、HTTP のメソッドで「どうするか」を表す API の作り方です。メモなら、次のように決めます。

| やりたいこと | メソッドとパス | この章で作る節 |
|---|---|---|
| 一覧を見る | `GET /notes` | この節 |
| 作る | `POST /notes` | この節 |
| 1 件を見る | `GET /notes/:id` | 02 |
| 書き換える | `PATCH /notes/:id` | 02 |
| 消す | `DELETE /notes/:id` | 02 |

`:id` の部分には、メモごとの ID が入ります。

## notes のモジュールを作る

メモ用のモジュール・コントローラー・サービスを、Nest CLI で作ります。

```bash
npx nest g module notes
npx nest g controller notes
npx nest g service notes
```

```text
CREATE src/notes/notes.module.ts (82 bytes)
UPDATE src/app.module.ts (321 bytes)
CREATE src/notes/notes.controller.ts (99 bytes)
UPDATE src/notes/notes.module.ts (173 bytes)
CREATE src/notes/notes.service.ts (89 bytes)
UPDATE src/notes/notes.module.ts (253 bytes)
```

`nest g` は、モジュールへの登録もします（`@nestjs/testing` を外したので、テストのファイルは作られません）。`AppModule` には `NotesModule` が足されています。

::diff{file="api/src/app.module.ts"}

`notes.module.ts` には、コントローラーとサービスが登録されています。

::diff{file="api/src/notes/notes.module.ts"}

## メモの形を決める

メモ 1 件の形と、作るときに受け取る値の形を、TypeScript の型で書きます。

| ファイル | 中身 |
|---|---|
| `notes/entities/note.entity.ts` | そのモジュールが扱うもの（エンティティ）の形。ここではメモ 1 件 |
| `notes/dto/create-note.dto.ts` | リクエストで受け取る値の形。DTO（Data Transfer Object）と呼ぶ |

::diff{file="api/src/notes/entities/note.entity.ts"}

日時は ISO 8601 形式の文字列（`2026-11-18T04:02:24.623Z`）で持ちます。

::diff{file="api/src/notes/dto/create-note.dto.ts"}

## サービスを書く

メモを配列に入れておき、一覧と作成の処理を書きます。

::diff{file="api/src/notes/notes.service.ts"}

- `randomUUID()` は、重ならない ID（UUID）を作る Node.js の関数です
- NestJS はサービスを 1 つだけ作って使い回す（シングルトン）ので、配列 `notes` のメモはリクエストをまたいで残ります

## コントローラーを書く

::diff{file="api/src/notes/notes.controller.ts"}

- `@Controller('notes')` で、このコントローラーのメソッドはすべて `/notes` から始まるパスになります
- `@Get()` は `GET /notes`、`@Post()` は `POST /notes` を受け付けます
- `POST` の応答は、既定で `201 Created` になります

## 動かす

`npm run start:dev` で起動すると、ログに 2 つのルートが増えています。

```text
[Nest] 46  - ...     LOG [RoutesResolver] NotesController {/notes}:
[Nest] 46  - ...     LOG [RouterExplorer] Mapped {/notes, GET} route
[Nest] 46  - ...     LOG [RouterExplorer] Mapped {/notes, POST} route
```

最初は空の配列が返ります。

```bash
curl http://localhost:3000/notes
```

```json
[]
```

メモを作ります。

:::::platform
::::macos-linux
```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"買い物","body":"牛乳を買う"}'
```
::::
::::windows
Windows の curl は、日本語の本文をうまく送れないことがあるので、本文を英語にしています。

```powershell
curl -X POST http://localhost:3000/notes `
  -H "Content-Type: application/json" `
  -d '{"title":"Shopping","body":"Buy milk"}'
```
::::
:::::

```json
{"id":"3b698a13-ddf5-40ec-8ec6-720004f0e9cd","title":"買い物","body":"牛乳を買う","createdAt":"2026-11-18T04:02:24.623Z","updatedAt":"2026-11-18T04:02:24.623Z"}
```

もう一度 `GET /notes` を呼ぶと、作ったメモが入っています。

## 困ったところ：何でも受け付けてしまう

`title` を数値にして、`body` を省いて送ってみます。

:::::platform
::::macos-linux
```bash
curl -i -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{"title":123}'
```
::::
::::windows
```powershell
curl -i -X POST http://localhost:3000/notes `
  -H "Content-Type: application/json" `
  -d '{"title":123}'
```
::::
:::::

```text
HTTP/1.1 201 Created
...
{"id":"38b8a264-...","title":123,"createdAt":"...","updatedAt":"..."}
```

`201 Created` で保存されてしまいました。`CreateNoteDto` は TypeScript の型なので、コンパイルのときにしか働かず、届いた JSON の中身は確かめません。次の節で **入力チェック** を入れます。

## 参考にした公式ドキュメント

この節は、次の公式ドキュメントをもとに書いています。

- [NestJS: Modules](https://docs.nestjs.com/modules) … モジュールの役割と、`dto/` などのファイルの置き方の例
- [NestJS: Providers](https://docs.nestjs.com/providers) … サービス（`@Injectable()`）と DI
- [NestJS: Controllers](https://docs.nestjs.com/controllers) … `@Post()`・`@Body()`・`@Param()`
- [NestJS: CLI command reference](https://docs.nestjs.com/cli/usages) … `nest g module` / `controller` / `service` で作れるもの

## この節を終えたときのディレクトリ

::tree

:::download
[この節を終えた状態をダウンロード](./project.zip)
:::

:::faq

### `npx nest g` で `command not found` や、パッケージのダウンロードが始まる

`api/` の中で実行していないか、`api/node_modules` がありません。`api/` で `npm install` を実行してから、もう一度試してください。

### API を再起動したらメモが消えた

メモリ上に持っているので、再起動すると消えます。`npm run start:dev` では、ファイルを保存したときも再起動するので消えます。

:::
