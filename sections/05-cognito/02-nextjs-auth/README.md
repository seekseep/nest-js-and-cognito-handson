# 05-02 Next.js からサインインする

Amplify の Authenticator で、サインインした人だけがメモの画面を見られるようにした状態です（API はまだ誰でも呼べます）。教材: `LECTURE.md`

## 動かし方

```bash
cp ui/.env.example ui/.env.local   # 自分のユーザープールの値に書き換える
podman compose up --build --watch              # http://localhost:3000 と http://localhost:3001
```
