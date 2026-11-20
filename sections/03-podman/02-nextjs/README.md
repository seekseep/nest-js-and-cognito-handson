# 03-02 Podman で Next.js を動かす

UI（Next.js）をコンテナで動かす節を終えた状態です。API はまだ手元の Node.js で動かします。教材: `LECTURE.md`

## 動かし方

Podman マシンと compose のプロバイダ（docker-compose）が必要です（03-01）。

```bash
podman compose up --build --watch    # http://localhost:3000
cd api && npm install && npm run start:dev      # 別のターミナルで。http://localhost:3001
```

止めるときは `Ctrl+C` のあと `podman compose down` です。
