# 10-03 E2E テスト

Playwright で画面を操作し、画面から BFF までをまとめて確かめる E2E テストを足した状態です。テストでの認証は、決め打ちのトークン（`alice-token`）で行います。教材: `LECTURE.md`

## 動かし方

```bash
npm install              # my-app/ 直下。Redocly CLI・openapi-typescript・Playwright
cp frontend/.env.example frontend/.env.local   # 自分のユーザープールの値に書き換える
cp bff/.env.example bff/.env                   # 同じく
podman compose up --build --watch
```

## テスト

```bash
(cd bff && npm install && npm test && npm run test:integration)   # 単体テスト・結合テスト
(cd frontend && npm install)
npx playwright install chromium   # 初回だけ。テストに使うブラウザを入れる
npm run test:e2e                  # E2E テスト（画面を 3100、BFF を 3101 で起動する）
```

Cognito の ID は、どのテストにも要りません。`USE_FAKE_AUTH=true`（BFF）と `NEXT_PUBLIC_FAKE_TOKEN`（画面）はテスト専用です。本番では設定しないでください。
