---
docs: true
title: 型生成の設定
---

# 型生成の設定

![06 章 型生成の設定](./images/00-thumbnail.svg)

`openapi.yaml` に書いた API の約束から、**openapi-typescript** で TypeScript の型を作ります。コードで使うのは次の節です。

## openapi-typescript を入れる

openapi-typescript は TypeScript 5 を前提にしていて、TypeScript 6 の `nest new` のプロジェクトにそのまま入れると、npm がエラーにします。

```text
npm error Could not resolve dependency:
npm error peer typescript@"^5.x" from openapi-typescript@7.13.0
```

そこで、先に `package.json` に `overrides` を書いて、openapi-typescript にこのプロジェクトの TypeScript（`"$typescript"`）を使わせます。

```json
  "overrides": {
    "openapi-typescript": {
      "typescript": "$typescript"
    }
  }
```

書いたら、入れます。

```bash
npm install -D openapi-typescript
```

## コマンドを用意する

`scripts` に 2 つのコマンドを足します。`package.json` の変更は、次のとおりです（`devDependencies` と `overrides` を含む）。

::diff{file="api/package.json"}

| コマンド | すること |
|---|---|
| `npm run generate:api` | `openapi.yaml` から `src/api/schema.d.ts` を作る（作り直す） |
| `npm run check:api` | `src/api/schema.d.ts` が `openapi.yaml` と合っているかだけを確かめる。古ければ失敗する |

`--default-non-nullable false` は、`default` のある項目（`CreateNoteInput` の `body`）を省略できる型（`body?: string`）にする設定です。

## 型を作る

```bash
npm run generate:api
```

```text
✨ openapi-typescript 7.13.0
🚀 openapi.yaml → src/api/schema.d.ts [39ms]
```

作られた `src/api/schema.d.ts` を開くと、`openapi.yaml` の中身が型になっています。

::diff{file="api/src/api/schema.d.ts"}

`components` に書いた部品は、`components` 型から取り出せます。

```ts
import type { components } from './api/schema.js';

type Note = components['schemas']['Note'];
```

型のファイルは手で直さず、`openapi.yaml` を変えたら `generate:api` で作り直します。ビルドに要るので Git に入れます。作り直し忘れは `check:api` で見つけられます。

```bash
npm run check:api
```

型が古いと、次のように失敗します（終了コードが 1 になる）。

```text
✘  Generated types are not up-to-date!
```

## 参考にした公式ドキュメント

この節は、次の公式ドキュメントをもとに書いています。

- [openapi-typescript: Introduction](https://openapi-ts.dev/introduction) … `openapi.yaml` から型を作る、`components["schemas"]` の使い方
- [openapi-typescript: CLI](https://openapi-ts.dev/cli) … `-o`・`--default-non-nullable`・`--check`
- [npm Docs: overrides](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#overrides) … `overrides` と、`$` で始まる参照（`"$typescript"`）

## この節を終えたときのディレクトリ

::tree

:::download
[この節を終えた状態をダウンロード](./project.zip)
:::

:::faq

### `npm install -D openapi-typescript` で `ERESOLVE unable to resolve dependency tree` と出る

`overrides` を書く前に入れようとしています。`package.json` に `overrides` を足してから、もう一度実行してください。

:::
