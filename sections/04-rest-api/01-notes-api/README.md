# 04-01 メモ API をつくる

BFF にメモの一覧（`GET /notes`）と作成（`POST /notes`）を足した状態です。入力チェックはまだありません。教材: `LECTURE.md`

## 動かし方

```bash
podman compose up --build --watch    # http://localhost:3000 と http://localhost:3001
```

Podman を使わないときは、ターミナルを 2 つ使います。

```bash
cd frontend && npm install && npm run dev
cd bff && npm install && npm run start:dev
```
