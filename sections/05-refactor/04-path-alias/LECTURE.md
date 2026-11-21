---
docs: true
title: パスに別名を付ける
---

# パスに別名を付ける

![05 章 パスに別名を付ける](./images/00-thumbnail.svg)

`dto/` と `entities/` のファイルは、`openapi.yaml` から作った型を `'../../api/index.js'` のように、階層をさかのぼって読み込んでいます。`tsconfig.json` で `src/api/` に `@/api` という別名を付け、どこからでも同じ書き方で読み込めるようにします。

::diff{file="api/tsconfig.json"}

- `paths` … import に書く名前と、実際のファイルの対応です。`@/api` と書くと、`src/api/index.ts` を読み込みます

::diff{file="api/src/notes/dto/create-note.dto.ts"}

::diff{file="api/src/notes/dto/update-note.dto.ts"}

::diff{file="api/src/notes/entities/note.entity.ts"}

ファイルを別の階層に動かしても、`@/api` の書き方は変わりません。

## 動作確認する

`npm run start:dev` で起動したまま、`api/openapi.yaml` の 5 つの操作を **Try it** で送ります。04 章の最後と同じ応答（`200`・`201`・`204`・`400`・`404`）が返れば、整理しても動きは変わっていません。

## 参考にした公式ドキュメント

この節は、次の公式ドキュメントをもとに書いています。

- [TypeScript: TSConfig Reference（paths）](https://www.typescriptlang.org/tsconfig/paths.html) … import の名前を、探す場所に対応させる `paths`

## この節を終えたときのディレクトリ

::tree

:::download
[この節を終えた状態をダウンロード](./project.zip)
:::
