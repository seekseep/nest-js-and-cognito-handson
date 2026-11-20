# 10-02 結合テスト

API を丸ごと組み立てて HTTP で呼ぶ結合テスト（supertest）を足した状態です。テストでの認証は、決め打ちのトークン（`alice-token` など）を通す偽物の `TokenVerifier` で行います。教材: `LECTURE.md`

## 動かし方

```bash
npm install              # my-app/ 直下。Redocly CLI と openapi-typescript
cp ui/.env.example ui/.env.local   # 自分のユーザープールの値に書き換える
cp api/.env.example api/.env                   # 同じく
podman compose up --build --watch
```

## テスト

```bash
cd api
npm install
npm test                  # 単体テスト
npm run test:integration  # 結合テスト（Cognito の ID は要らない）
```
