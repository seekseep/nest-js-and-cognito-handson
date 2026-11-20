import { defineConfig, devices } from '@playwright/test';

// E2E テスト用の画面と API。podman compose up の 3000・3001 とぶつからないポートで起動する
const UI_URL = 'http://localhost:3100';
const API_URL = 'http://localhost:3101';

// 画面が API に送る、決め打ちのトークン（api/src/auth/fake-token-verifier.ts）
const FAKE_TOKEN = 'alice-token';

export default defineConfig({
  testDir: './e2e',
  // CI では、うっかり残した test.only を落とす
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: UI_URL,
    // 落ちたテストを、もう一度動かしたときの記録（トレース）を残す
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // テストの前に、API と画面を起動する
  webServer: [
    {
      name: 'API',
      command: 'npm run start',
      cwd: './api',
      url: `${API_URL}/`,
      env: {
        PORT: '3101',
        // 決め打ちのトークンを通す偽物の TokenVerifier を使う
        USE_FAKE_AUTH: 'true',
        CORS_ORIGIN: UI_URL,
      },
      reuseExistingServer: !process.env.CI,
    },
    {
      name: 'UI',
      command: 'npm run dev -- --port 3100',
      cwd: './ui',
      url: UI_URL,
      env: {
        NEXT_PUBLIC_API_URL: API_URL,
        // Cognito でのサインインを飛ばし、このトークンを API に送る
        NEXT_PUBLIC_FAKE_TOKEN: FAKE_TOKEN,
      },
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  ],
});
