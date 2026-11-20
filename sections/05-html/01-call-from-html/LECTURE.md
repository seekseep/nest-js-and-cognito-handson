---
docs: true
title: HTML から API を呼ぶ
---

# HTML から API を呼ぶ

![05 章 HTML から API を呼ぶ](./images/00-thumbnail.svg)

ここまでは curl で API を呼んできました。この節では、ブラウザの画面からメモの一覧・追加・削除ができるようにします。

画面は HTML 1 枚だけで作ります。React のようなフレームワークは使わず、ブラウザに最初から入っている `fetch` で API を呼びます。HTML は NestJS から配るので、API と同じ <http://localhost:3000> で開けます。

![HTML の画面。メモの追加のフォーム、入力チェックのエラー、メモの一覧と削除のボタン](./images/01-notes-page.png)

## `/` を画面に譲る

`nest new` が作った `GET /`（`Hello World!` を返す）は、もう使いません。<http://localhost:3000/> を開いたら画面が出るように、`/` を空けます。

コントローラーから `getHello()` を消し、`GET /greeting` のあいさつを作る処理をサービスに移します。

::diff{file="api/src/app.controller.ts"}

::diff{file="api/src/app.service.ts"}

`getHello()` を確かめていたテストも、`getGreeting()` を確かめるように直します。

::diff{file="api/src/app.controller.spec.ts"}

`test/app.e2e-spec.ts`（API を HTTP で呼ぶテスト。`npm run test:e2e` で動く）も、`GET /` ではなく `GET /greeting` を確かめるようにします。

::diff{file="api/test/app.e2e-spec.ts"}

## HTML を配る

`api/public/` に置いたファイルを、そのまま配るようにします。

::diff{file="api/src/main.ts"}

- `NestFactory.create<NestExpressApplication>(...)` … NestJS は中で Express を使っています。この型を付けると、Express の機能を使う `useStaticAssets()` を呼べるようになります
- `app.useStaticAssets(join(import.meta.dirname, '..', 'public'))` … `public/` のファイルを、そのままのパスで配ります。`public/index.html` は `/` で開けます
- `import.meta.dirname` は、このファイルのあるフォルダです。ビルドすると `dist/main.js` から動くので、`..` で `api/` に戻り、`api/public/` を指します

## 画面を書く

::diff{file="api/public/index.html"}

- `request()` … `fetch` で API を呼び、応答が `2xx` でなければ、前の章でそろえたエラーの形（`ErrorBody`）の `messages` を取り出して、エラーとして投げます。`DELETE` の `204 No Content` には本文が無いので、読まずに `null` を返します
- `showNotes()` … `GET /notes` で一覧を取り、`<ul>` の中身を作り直します。メモのタイトルと本文は `textContent` で入れます。`innerHTML` を使うと、メモに書かれた `<script>` などが HTML として動いてしまうからです
- 削除のボタン … `DELETE /notes/:id` を呼び、一覧を出し直します
- フォームを送ったとき … `POST /notes` に JSON を送り、成功したらフォームを空にして一覧を出し直します。入力チェックで `400` になったら、`messages` を画面に出します

`<script type="module">` の中では、いちばん外側で `await` が使えます（最後の `await showNotes();`）。

## 動かす

```bash
npm run start:dev
```

ブラウザで <http://localhost:3000/> を開きます。タイトルと本文を入れて **追加** を押すと、一覧にメモが増えます。**削除** を押すと消えます。タイトルを空のまま **追加** を押すと、API の入力チェックのエラーが赤い文字で出ます。

curl でも、`/` が HTML を返すことを確かめられます。

```bash
curl -i http://localhost:3000/
```

```text
HTTP/1.1 200 OK
X-Powered-By: Express
Accept-Ranges: bytes
Cache-Control: public, max-age=0
...
Content-Type: text/html; charset=utf-8
...

<!doctype html>
<html lang="ja">
...
```

ブラウザの開発者ツール（F12）の **Network** タブを開いてから操作すると、画面が API に送ったリクエストと応答を 1 つずつ見られます。

:::notice
`public/` のファイルは、NestJS の middleware より前に、Express が返しています。そのため、前の章のログ（`[HTTP]`）には `GET /` が出ません。出るのは、画面が呼んだ API（`/notes`）だけです。
:::

## コラム：CORS

この節の画面は、API と同じ <http://localhost:3000> から配っているので、そのまま API を呼べました。画面を別の場所（たとえば `http://localhost:5173` の開発サーバーや、別のドメイン）から配ると、ブラウザは **CORS**（Cross-Origin Resource Sharing）の決まりで、API の応答を画面に渡さなくなります。オリジン（スキーム・ホスト・ポートの組）が違うからです。

そのときは、API の側で「このオリジンからの呼び出しを許す」と応答に書きます。NestJS では `main.ts` で次のようにします。

```ts
app.enableCors({ origin: 'http://localhost:5173' });
```

curl や Postman は CORS の決まりを守る必要がないので、CORS の設定が無くても呼べます。CORS は、ブラウザが利用者を守るための仕組みです。

## 参考にした公式ドキュメント

この節は、次の公式ドキュメントをもとに書いています。

- [NestJS: Model-View-Controller](https://docs.nestjs.com/http/mvc) … `NestExpressApplication` と `app.useStaticAssets(join(import.meta.dirname, '..', 'public'))`
- [NestJS: CORS](https://docs.nestjs.com/security/cors) … `app.enableCors()`
- [MDN: Fetch API の使用](https://developer.mozilla.org/ja/docs/Web/API/Fetch_API/Using_Fetch) … `fetch` で JSON を送る・受け取る、`response.ok`
- [MDN: オリジン間リソース共有 (CORS)](https://developer.mozilla.org/ja/docs/Web/HTTP/Guides/CORS) … オリジンが違うときにブラウザがすること

## この節を終えたときのディレクトリ

::tree

:::download
[この節を終えた状態をダウンロード](./project.zip)
:::

:::faq

### `http://localhost:3000/` を開くと `Cannot GET /` と出る

`api/public/index.html` の場所を確かめてください。`api/src/public/` ではなく、`src/` と同じ階層の `api/public/` に置きます。`main.ts` の `useStaticAssets` を書き足したあと、API を起動し直したかも確かめます。

### `index.html` を書き換えたのに、画面が変わらない

`public/` のファイルは、そのまま配られるので、ビルドも再起動も要りません。ブラウザを再読み込みしてください。それでも変わらないときは、ブラウザのキャッシュを消して再読み込み（Windows・Linux は Ctrl + Shift + R、macOS は Cmd + Shift + R）します。

### `file://` で `index.html` を直接開いたら動かない

`fetch('/notes')` のパスは、画面を開いた場所から決まります。`file://` で開くと、API の <http://localhost:3000> に届きません。NestJS を起動して、<http://localhost:3000/> から開いてください。

:::
