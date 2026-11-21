---
docs: true
title: 更新の設計
---

# 更新の設計

![03 章 更新の設計](./images/00-thumbnail.svg)

メモを書き換える操作（Update）を書き足します。

| メソッド | パス | 中身 |
|---|---|---|
| `PUT` | `/notes/{id}` | 送った中身でメモを置き換えて返す |

::diff{file="api/openapi.yaml"}

- `PUT` は、送った中身でまるごと置き換えるメソッドです
- **`title` と `body` の両方を必ず送ります**。`required: [title, body]` で、どちらも省略できないことを書きます。片方だけ送ると `400` になります
- Create と違って `default` を書きません。全部の項目を送るので、補う値は要りません

## 部分更新にする場合

タイトルだけ・本文だけのように、送った項目だけを書き換えることを **部分更新** と呼びます。部分更新には `PATCH` を使うのが HTTP の決まりです。`PATCH` にするときは、メソッドを `patch` にし、本文の `required` を外して、どの項目も省略できるようにします。

:::warning[PUT での部分更新は標準ではない]
`PUT` でも、送られてこなかった項目をもとの値のままにする実装はできます。ただし、HTTP の決まりでは `PUT` は「送った中身で置き換える」メソッドです。`PUT` で部分更新にすると、使う人が「省略した項目は消える」と「省略した項目は残る」のどちらなのか分からなくなります。部分更新にするなら `PATCH` を使います。
:::

## プレビューで確かめる

VS Code で `api/openapi.yaml` を開き、エディタの右上のプレビューのボタンを押します。横に API のドキュメントの画面が出ます。 `PUT /notes/{id}` が増え、本文の `title` と `body` が必須になっていれば大丈夫です。

## 参考にした公式ドキュメント

この節は、次の公式ドキュメントをもとに書いています。

- [OpenAPI Specification v3.0.3](https://spec.openapis.org/oas/v3.0.3.html) … Request Body Object
- [RFC 9110: PUT](https://www.rfc-editor.org/rfc/rfc9110.html#name-put) … `PUT` は送った中身で置き換えること
- [RFC 5789: PATCH Method for HTTP](https://www.rfc-editor.org/rfc/rfc5789.html) … 部分更新には `PATCH` を使うこと

## この節を終えたときのディレクトリ

::tree

:::download
[この節を終えた状態をダウンロード](./project.zip)
:::
