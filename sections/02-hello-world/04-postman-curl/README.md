# 02-04 Postman と curl で API を呼ぶ

BFF に `GET /greeting` と `POST /echo` を足し、curl と Postman で呼び出す節を終えた状態です。教材: `LECTURE.md`

## 動かし方

ターミナルを 2 つ使います。

```bash
cd frontend && npm install && npm run dev       # http://localhost:3000
cd bff && npm install && npm run start:dev      # http://localhost:3001
```
