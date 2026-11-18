# 04-03 Next.js から API を呼ぶ

Next.js の画面からメモの一覧・追加・削除ができる状態です。BFF で CORS を有効にしています。教材: `LECTURE.md`

## 動かし方

```bash
podman compose up --build --watch    # http://localhost:3000 と http://localhost:3001
```

Podman を使わないときは、ターミナルを 2 つ使います。

```bash
cd frontend && npm install && npm run dev
cd bff && npm install && npm run start:dev
```

ブラウザで http://localhost:3000 を開きます。
