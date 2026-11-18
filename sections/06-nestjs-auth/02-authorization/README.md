# 06-02 認可 — グループと持ち主

メモに持ち主（Cognito の `sub`）を持たせ、自分のメモだけを扱えるようにした状態です。Cognito の `admin` グループに入っている人は、全員のメモを扱えます。教材: `LECTURE.md`

## 動かし方

```bash
cp frontend/.env.example frontend/.env.local   # 自分のユーザープールの値に書き換える
cp bff/.env.example bff/.env                   # 同じく
podman compose up --build --watch              # http://localhost:3000 と http://localhost:3001
```

テスト（認可の判定）は `cd bff && npm test` です。
