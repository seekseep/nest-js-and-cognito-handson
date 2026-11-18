# 05-01 Cognito の設定

Cognito のユーザープールの ID を書く `.env.example` を足し、compose から frontend のコンテナに `.env.local` を渡すようにした状態です。画面はまだ変わりません。教材: `LECTURE.md`

## 動かし方

```bash
cp frontend/.env.example frontend/.env.local   # 自分のユーザープールの値に書き換える
podman compose up --build --watch              # http://localhost:3000 と http://localhost:3001
```
