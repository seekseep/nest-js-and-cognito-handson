# 07-01 OpenAPI の書き方

メモ API の約束を `openapi.yaml` に書いた状態です。アプリのコードは 06-02 と同じです。教材: `LECTURE.md`

## 動かし方

```bash
cp frontend/.env.example frontend/.env.local   # 自分のユーザープールの値に書き換える
cp bff/.env.example bff/.env                   # 同じく
podman compose up --build --watch              # http://localhost:3000 と http://localhost:3001
```
