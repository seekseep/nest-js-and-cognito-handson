---
docs: true
title: メモ API をつくる
---

# メモ API をつくる

![04 章 メモ API をつくる](./images/00-thumbnail.svg)

この章では、API に **メモ** を読み書きする REST API を作り、最後に Next.js の画面から呼び出します。この節では、メモの一覧と作成の 2 つを作ります。

| メソッド | パス | 中身 |
|---|---|---|
| `GET` | `/notes` | メモの一覧を返す |
| `POST` | `/notes` | 本文（JSON）からメモを作って返す |

メモはデータベースではなく、API のメモリ上（配列）に持ちます。API を再起動すると消えますが、API の作り方を覚えるにはこれで十分です。

## REST API とは

**REST API** は、URL で「何を」（リソース）、HTTP のメソッドで「どうするか」を表す API の作り方です。メモなら、次のように決めるのが一般的です。

| やりたいこと | メソッドとパス | この章で作る節 |
|---|---|---|
| 一覧を見る | `GET /notes` | この節 |
| 作る | `POST /notes` | この節 |
| 1 件を見る | `GET /notes/:id` | 02 |
| 書き換える | `PATCH /notes/:id` | 02 |
| 消す | `DELETE /notes/:id` | 02 |

`:id` の部分には、メモごとの ID が入ります。

## notes のモジュールを作る

02 章で見たとおり、NestJS ではコントローラー（URL の受け付け）とサービス（処理の中身）を、モジュールにまとめます。メモ用のモジュール・コントローラー・サービスを、Nest CLI で作ります。

```bash
cd api
npx nest g module notes
npx nest g controller notes
npx nest g service notes
```

```text
CREATE src/notes/notes.module.ts (82 bytes)
UPDATE src/app.module.ts (321 bytes)
CREATE src/notes/notes.controller.spec.ts (488 bytes)
CREATE src/notes/notes.controller.ts (99 bytes)
UPDATE src/notes/notes.module.ts (173 bytes)
CREATE src/notes/notes.service.spec.ts (456 bytes)
CREATE src/notes/notes.service.ts (89 bytes)
UPDATE src/notes/notes.module.ts (253 bytes)
```

:::warning
`nest g` は手元のターミナルで実行してください。`podman compose exec api` でコンテナの中で実行すると、作ったファイルはコンテナの中にしかできず、手元には戻ってきません（`watch` は手元からコンテナへの一方向です）。手元に `node_modules` が無ければ、先に `npm install` を実行します。
:::

`nest g` は、ファイルを作るだけでなく、モジュールへの登録もしてくれます。`AppModule` には `NotesModule` が足されています。

::diff{file="api/src/app.module.ts"}

`notes.module.ts` には、コントローラーとサービスが登録されています。

::diff{file="api/src/notes/notes.module.ts"}

## メモの形を決める

メモ 1 件の形と、作るときに受け取る値の形を、TypeScript の型で書いておきます。

::diff{file="api/src/notes/note.ts"}

`id` はメモを区別するための値、`createdAt` / `updatedAt` は作った日時と更新した日時です。日時は JSON にしやすいように、ISO 8601 形式の文字列（`2026-11-18T04:02:24.623Z`）で持ちます。

## サービスを書く

メモを配列に入れておき、一覧と作成の処理を書きます。

::diff{file="api/src/notes/notes.service.ts"}

- `randomUUID()` は Node.js に入っている関数で、重ならない ID（UUID）を作ります
- `private readonly notes` は、このサービスの中だけで使う配列です。NestJS はサービスを 1 つだけ作って使い回す（シングルトン）ので、リクエストをまたいでメモが残ります

## コントローラーを書く

::diff{file="api/src/notes/notes.controller.ts"}

- `@Controller('notes')` で、このコントローラーのメソッドはすべて `/notes` から始まるパスになります
- `@Get()` は `GET /notes`、`@Post()` は `POST /notes` を受け付けます
- `@Body()` は、リクエストの本文（JSON）を引数に入れます
- `POST` の応答は、既定で `201 Created` になります

コントローラーが `NotesService` を使うようになったので、`nest g` が作ったテストにもサービスを登録します。登録しないと、テストで「`NotesService` が見つからない」というエラーになります。

::diff{file="api/src/notes/notes.controller.spec.ts"}

## 動かす

03 章のとおり `podman compose up --build --watch` で起動します（手元で動かす人は `npm run start:dev`）。ログに 2 つのルートが増えています。

```text
api-1  | [Nest] 46  - ...     LOG [RoutesResolver] NotesController {/notes}:
api-1  | [Nest] 46  - ...     LOG [RouterExplorer] Mapped {/notes, GET} route
api-1  | [Nest] 46  - ...     LOG [RouterExplorer] Mapped {/notes, POST} route
```

最初は空の配列が返ります。

```bash
curl http://localhost:3001/notes
```

```json
[]
```

メモを作ります。

```bash
curl -X POST http://localhost:3001/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"買い物","body":"牛乳を買う"}'
```

```json
{"id":"3b698a13-ddf5-40ec-8ec6-720004f0e9cd","title":"買い物","body":"牛乳を買う","createdAt":"2026-11-18T04:02:24.623Z","updatedAt":"2026-11-18T04:02:24.623Z"}
```

もう一度 `GET /notes` を呼ぶと、作ったメモが入っています。

## 困ったところ：何でも受け付けてしまう

`title` を数値にして、`body` を省いて送ってみます。

```bash
curl -i -X POST http://localhost:3001/notes \
  -H "Content-Type: application/json" \
  -d '{"title":123}'
```

```text
HTTP/1.1 201 Created
...
{"id":"38b8a264-...","title":123,"createdAt":"...","updatedAt":"..."}
```

`201 Created` で保存されてしまいました。`CreateNoteInput` は TypeScript の型なので、コンパイルのときにしか働かず、実際に届いた JSON の中身は確かめていません。次の節で、届いた値を確かめる **入力チェック** を入れます。

## この節を終えたときのディレクトリ

::tree

:::download
[この節を終えた状態をダウンロード](./project.zip)
:::

:::faq

### `npx nest g` で `command not found` や、パッケージのダウンロードが始まる

`api/` の中で実行していないか、手元の `api/node_modules` がありません。`cd api && npm install` を実行してから、もう一度試してください。

### API を再起動したらメモが消えた

メモリ上に持っているので、再起動すると消えます。`watch` でファイルを保存したときも再起動するので消えます。この章ではこれで進めます。

### `npm test` で `Nest can't resolve dependencies of the NotesController` と出る

`notes.controller.spec.ts` の `providers` に `NotesService` を足していません。

:::
