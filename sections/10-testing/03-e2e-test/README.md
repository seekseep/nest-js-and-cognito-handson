# 10-03 E2E テスト

Playwright で画面を操作し、画面から API までをまとめて確かめる E2E テストを足した状態です。テストでの認証は、決め打ちのトークン（`alice-token`）で行います。教材: `LECTURE.md`

## 動かし方

```bash
npm install              # my-app/ 直下。Redocly CLI・openapi-typescript・Playwright
cp ui/.env.example ui/.env.local   # 自分のユーザープールの値に書き換える
cp api/.env.example api/.env                   # 同じく
podman compose up --build --watch
```

## テスト

```bash
(cd api && npm install && npm test && npm run test:integration)   # 単体テスト・結合テスト
(cd ui && npm install)
npx playwright install chromium   # 初回だけ。テストに使うブラウザを入れる
npm run test:e2e                  # E2E テスト（画面を 3100、API を 3101 で起動する）
```

Cognito の ID は、どのテストにも要りません。`USE_FAKE_AUTH=true`（API）と `NEXT_PUBLIC_FAKE_TOKEN`（画面）はテスト専用です。本番では設定しないでください。
