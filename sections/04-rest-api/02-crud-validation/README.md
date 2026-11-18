# 04-02 更新・削除と入力チェック

メモ API に 1 件の取得・更新・削除と、Zod による入力チェックを足した状態です。教材: `LECTURE.md`

## 動かし方

```bash
podman compose up --build --watch    # http://localhost:3000 と http://localhost:3001
```

Podman を使わないときは、ターミナルを 2 つ使います。

```bash
cd frontend && npm install && npm run dev
cd bff && npm install && npm run start:dev
```
