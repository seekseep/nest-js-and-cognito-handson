#!/usr/bin/env node
/**
 * 各節の先頭サムネイル（images/00-thumbnail.svg）を、同じ見た目で生成する。
 *
 *   node tools/thumbnail.mjs            … 下の THUMBNAILS をすべて書き出す
 *
 * 節を足したら THUMBNAILS に 1 行足して実行する。チップは「その節で触る道具」。
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// 道具ごとの色。チップの左の丸に使う。
const TOOL_COLORS = {
  'Node.js': '#5FA04E',
  nvm: '#5FA04E',
  Podman: '#892CA0',
  compose: '#892CA0',
  'Next.js': '#111111',
  NestJS: '#E0234E',
  curl: '#0A6EBD',
  Postman: '#FF6C37',
  Cognito: '#DD344C',
  Amplify: '#FF9900',
  S3: '#3F8624',
  JWT: '#D63AFF',
  OpenAPI: '#6BA539',
  'VS Code': '#007ACC',
  TypeScript: '#3178C6',
  Middleware: '#475569',
  Guard: '#475569',
  Filter: '#475569',
  Logger: '#475569',
  Vitest: '#729B1B',
  supertest: '#475569',
  Playwright: '#2EAD33',
};

const THUMBNAILS = [
  ['01-setup/01-nodejs', '01', 'Node.js を入れる', ['Node.js', 'nvm']],
  ['01-setup/02-podman', '01', 'Podman を入れる', ['Podman']],
  ['02-hello-world/01-nextjs', '02', 'Next.js SSG の Hello World', ['Next.js', 'S3']],
  ['02-hello-world/02-nestjs', '02', 'NestJS の Hello World', ['NestJS']],
  ['02-hello-world/03-decorators', '02', 'NestJS のデコレーター', ['NestJS', 'TypeScript']],
  ['02-hello-world/04-postman-curl', '02', 'Postman と curl で API を呼ぶ', ['curl', 'Postman']],
  ['03-podman/01-setup', '03', 'Podman の構築', ['Podman', 'compose']],
  ['03-podman/02-nextjs', '03', 'Podman で Next.js を動かす', ['Podman', 'Next.js']],
  ['03-podman/03-nestjs', '03', 'Podman で NestJS を動かす', ['Podman', 'NestJS']],
  ['04-rest-api/01-notes-api', '04', 'メモ API をつくる', ['NestJS']],
  ['04-rest-api/02-crud-validation', '04', '更新・削除と入力チェック', ['NestJS']],
  ['04-rest-api/03-call-from-nextjs', '04', 'Next.js から API を呼ぶ', ['Next.js', 'NestJS']],
  ['05-cognito/01-user-pool', '05', 'Cognito の設定', ['Cognito']],
  ['05-cognito/02-nextjs-auth', '05', 'Next.js からサインインする', ['Next.js', 'Amplify', 'Cognito']],
  ['06-nestjs-auth/01-authentication', '06', '認証 — トークンを検証する', ['NestJS', 'JWT', 'Guard']],
  ['06-nestjs-auth/02-authorization', '06', '認可 — グループと持ち主', ['NestJS', 'Cognito', 'Guard']],
  ['07-openapi/01-writing', '07', 'OpenAPI の書き方', ['OpenAPI']],
  ['07-openapi/02-extensions', '07', 'VS Code 拡張機能の紹介', ['OpenAPI', 'VS Code']],
  ['07-openapi/03-type-generation', '07', '型生成の設定', ['OpenAPI', 'TypeScript']],
  ['08-openapi-integration/01-types', '08', '生成した型を使う', ['OpenAPI', 'TypeScript', 'NestJS']],
  ['08-openapi-integration/02-api-client', '08', '型付きで API を呼ぶ', ['OpenAPI', 'Next.js']],
  ['09-middleware/01-global-auth', '09', 'アプリケーション全体の認証認可', ['NestJS', 'Guard']],
  ['09-middleware/02-route-auth', '09', 'パス単位の認証認可', ['NestJS', 'Middleware']],
  ['09-middleware/03-error-handling', '09', 'エラーハンドリング', ['NestJS', 'Filter']],
  ['09-middleware/04-logging', '09', 'ロギング', ['NestJS', 'Middleware', 'Logger']],
  ['10-testing/01-unit-test', '10', '単体テスト', ['Vitest', 'NestJS']],
  ['10-testing/02-integration-test', '10', '結合テスト', ['Vitest', 'supertest', 'NestJS']],
  ['10-testing/03-e2e-test', '10', 'E2E テスト', ['Playwright', 'Next.js', 'NestJS']],
];

function escapeXml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);
}

// 全角は 1、半角は 0.55 として、だいたいの文字幅を見積もる（チップの幅を決めるため）。
function textWidth(s, size) {
  let w = 0;
  for (const ch of s) w += /[\u0000-ÿ]/.test(ch) ? 0.62 : 1;
  return w * size;
}

function render(chapter, title, tools) {
  const W = 960;
  const H = 400;
  const font = `'Hiragino Sans','Noto Sans JP','Yu Gothic UI',system-ui,sans-serif`;
  const titleSize = textWidth(title, 46) > W - 120 ? 38 : 46;
  let x = 64;
  const chips = tools
    .map((tool) => {
      const label = escapeXml(tool);
      const w = textWidth(tool, 22) + 76;
      const color = TOOL_COLORS[tool] ?? '#475569';
      const g = `<g transform="translate(${x} 270)"><rect width="${w}" height="52" rx="26" fill="#ffffff" stroke="#d6dde8" stroke-width="2"/><circle cx="28" cy="26" r="9" fill="${color}"/><text x="46" y="34" font-size="22" font-weight="600" fill="#1e293b" font-family="${font}">${label}</text></g>`;
      x += w + 16;
      return g;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${escapeXml(`${chapter} 章: ${title}`)}">
<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef4ff"/><stop offset="1" stop-color="#fdf2f8"/></linearGradient></defs>
<rect width="${W}" height="${H}" rx="24" fill="url(#bg)"/>
<circle cx="860" cy="70" r="120" fill="#e0234e" opacity="0.07"/>
<circle cx="900" cy="330" r="90" fill="#111111" opacity="0.05"/>
<text x="64" y="104" font-size="24" font-weight="700" fill="#e0234e" font-family="${font}" letter-spacing="2">CHAPTER ${escapeXml(chapter)}</text>
<text x="64" y="186" font-size="${titleSize}" font-weight="800" fill="#0f172a" font-family="${font}">${escapeXml(title)}</text>
<rect x="64" y="216" width="96" height="6" rx="3" fill="#0f172a"/>
${chips}
</svg>
`;
}

let count = 0;
for (const [rel, chapter, title, tools] of THUMBNAILS) {
  // まだ作っていない節は飛ばす（節のディレクトリを先回りして作らない）。
  const lectureDir = path.join(ROOT, 'sections', ...rel.split('/'));
  if (!existsSync(lectureDir)) continue;
  const dir = path.join(lectureDir, 'images');
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, '00-thumbnail.svg'), render(chapter, title, tools));
  count += 1;
}
console.log(`[thumbnail] wrote ${count} thumbnails`);
