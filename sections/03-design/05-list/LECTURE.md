---
docs: true
title: 一覧取得の設計
---

# 一覧取得の設計

![03 章 一覧取得の設計](./images/00-thumbnail.svg)

メモの一覧を返す操作（List）を書き足します。

| メソッド | パス | 中身 |
|---|---|---|
| `GET` | `/notes` | メモの一覧を返す |

::diff{file="api/openapi.yaml"}

- `/notes` に `get` を足します。同じパスに、メソッドごとの操作を並べて書きます
- 一覧なので、応答は `type: array` で、`items` に 1 件の形を書きます

## クエリー文字列のパラメーターの書き方

`/notes?limit=10` の `?` より後ろを **クエリー文字列** と呼びます。一覧の件数や絞り込みの条件を渡すのに使います。このハンズオンの一覧では使いませんが、書くときはパスパラメーターと同じく `parameters` に書きます。

```yaml
  /notes:
    get:
      parameters:
        - name: limit
          in: query
          required: false
          schema:
            type: integer
            minimum: 1
```

- `in: query` … クエリー文字列の値だという意味です
- `required: false` … 省略できる値にします。パスパラメーターと違い、省略できるようにすることが多いです
- パス（`/notes`）には書きません。`/notes?limit=10` も `/notes` も、同じ `get` の操作になります

## プレビューで確かめる

VS Code で `api/openapi.yaml` を開き、エディタの右上のプレビューのボタンを押します。横に API のドキュメントの画面が出ます。 `GET /notes` が増え、応答がメモの配列になっていれば大丈夫です。

## 参考にした公式ドキュメント

この節は、次の公式ドキュメントをもとに書いています。

- [OpenAPI Specification v3.0.3](https://spec.openapis.org/oas/v3.0.3.html) … Schema Object の `type: array` と `items`、Parameter Object の `in: query`

## この節を終えたときのディレクトリ

::tree

:::download
[この節を終えた状態をダウンロード](./project.zip)
:::
