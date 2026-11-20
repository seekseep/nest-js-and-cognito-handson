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
  OpenAPI: '#6BA539',
  'VS Code': '#007ACC',
  TypeScript: '#3178C6',
  Zod: '#3068B7',
  SQLite: '#0F80CC',
};

const THUMBNAILS = [
  ['01-setup/01-nodejs', '01', 'Node.js と VS Code を入れる', ['Node.js', 'VS Code']],
  ['02-hello-world/01-nestjs', '02', 'NestJS の Hello World', ['NestJS']],
  ['03-design/01-create', '03', 'Create を設計する', ['OpenAPI']],
  ['03-design/02-get', '03', 'Get を設計する', ['OpenAPI']],
  ['03-design/03-list', '03', 'List を設計する', ['OpenAPI']],
  ['03-design/04-update', '03', 'Update を設計する', ['OpenAPI']],
  ['03-design/05-delete', '03', 'Delete を設計する', ['OpenAPI']],
  ['03-design/06-components', '03', '共通部分をまとめる', ['OpenAPI']],
  ['04-implementation/01-sqlite', '04', 'SQLite を用意する', ['SQLite', 'Node.js']],
  ['04-implementation/02-create', '04', 'Create を実装する', ['NestJS', 'TypeScript', 'Zod']],
  ['04-implementation/03-get', '04', 'Get を実装する', ['NestJS', 'SQLite']],
  ['04-implementation/04-list', '04', 'List を実装する', ['NestJS', 'SQLite']],
  ['04-implementation/05-update', '04', 'Update を実装する', ['NestJS', 'Zod']],
  ['04-implementation/06-delete', '04', 'Delete を実装する', ['NestJS', 'SQLite']],
  ['05-refactor/01-database-provider', '05', 'データベースをプロバイダーに分ける', ['NestJS', 'SQLite']],
  ['05-refactor/02-dto', '05', '入力を dto/ に分ける', ['NestJS', 'Zod']],
  ['05-refactor/03-entities', '05', 'データの形を entities/ に分ける', ['NestJS', 'TypeScript']],
  ['05-refactor/04-service', '05', '処理をサービスに分ける', ['NestJS']],
  ['05-refactor/05-module', '05', 'notes モジュールに分ける', ['NestJS']],
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
