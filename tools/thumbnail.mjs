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
  npm: '#CB3837',
  NestJS: '#E0234E',
  curl: '#0A6EBD',
  Postman: '#FF6C37',
  OpenAPI: '#6BA539',
  'VS Code': '#007ACC',
  TypeScript: '#3178C6',
  Middleware: '#475569',
  Filter: '#475569',
  Logger: '#475569',
  Zod: '#3068B7',
  HTML: '#E34F26',
  fetch: '#475569',
  Redocly: '#DC4C3E',
};

const THUMBNAILS = [
  ['01-setup/01-nodejs', '01', 'Node.js と VS Code を入れる', ['Node.js', 'npm', 'VS Code']],
  ['02-hello-world/01-nestjs', '02', 'NestJS の Hello World', ['NestJS']],
  ['02-hello-world/02-decorators', '02', 'NestJS のデコレーター', ['NestJS', 'TypeScript']],
  ['02-hello-world/03-curl-postman', '02', 'curl と Postman で API を呼ぶ', ['curl', 'Postman']],
  ['03-rest-api/01-notes-api', '03', 'メモ API をつくる', ['NestJS']],
  ['03-rest-api/02-crud-validation', '03', '更新・削除と入力チェック', ['NestJS', 'Zod']],
  ['04-errors-and-logs/01-error-handling', '04', 'エラーの形をそろえる', ['NestJS', 'Filter']],
  ['04-errors-and-logs/02-logging', '04', 'リクエストのログ', ['NestJS', 'Middleware', 'Logger']],
  ['05-html/01-call-from-html', '05', 'HTML から API を呼ぶ', ['HTML', 'fetch', 'NestJS']],
  ['06-openapi/01-writing', '06', 'OpenAPI の書き方', ['OpenAPI']],
  ['06-openapi/02-extensions', '06', 'VS Code 拡張機能と lint', ['OpenAPI', 'VS Code', 'Redocly']],
  ['06-openapi/03-type-generation', '06', '型生成の設定', ['OpenAPI', 'TypeScript']],
  ['06-openapi/04-use-types', '06', '生成した型を使う', ['OpenAPI', 'TypeScript', 'NestJS']],
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
