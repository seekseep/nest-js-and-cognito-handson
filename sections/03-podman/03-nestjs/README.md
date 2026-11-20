# 03-03 Podman で NestJS を動かす

UI（Next.js）と API（NestJS）の両方をコンテナで動かす節を終えた状態です。教材: `LECTURE.md`

## 動かし方

Podman マシンと compose のプロバイダ（docker-compose）が必要です（03-01）。

```bash
podman compose up --build --watch    # http://localhost:3000 と http://localhost:3001
```

止めるときは `Ctrl+C` のあと `podman compose down` です。
