/**
 * 「前の節と比べて何が変わったか」を本文に出すセンチネル。sentinels.mjs から呼ばれる。
 *
 *   ::diff{file="bff/src/main.ts"}
 *     … 前の節（libs/lectures.mjs の previousProjectLecture）の同じファイルと比べた差分を、
 *       `:::code{filepath=... offset=... newOffset=...}` ＋ 差分のコードブロックに展開する。
 *       前の節に無いファイルは全行が `+`、この節で消したファイルは全行が `-` になる。
 *       変更箇所が離れていれば、塊（hunk）ごとにブロックを分ける。
 *   ::diff[説明]{file="..."}            … 最初のブロックの上に「どこに書くか」の説明を出す。
 *   ::diff{file="..." from="<sec>/<lec>"}  … 比べる相手の節を指定する（既定は直前の節）。
 *   ::diff{file="..." fromFile="..."}   … 前の節でのファイル名が違うとき（移動・改名）。
 *   ::diff{file="..." context="5"}      … 変更の前後に何行出すか（既定 3）。
 *
 *   ::tree
 *     … この節を終えたときのプロジェクトのディレクトリツリー。前の節と比べて
 *       追加したファイルを緑（ins）、変更したファイルを強調（mark）で示し、行末に印を付ける。
 *       消したファイルは末尾にまとめて出す。
 *   ::tree{from="<sec>/<lec>"}          … 比べる相手の節を指定する。
 *
 * 本文にコードを二重に書かないための仕掛け。サンプルを直せば本文の差分も自動で追従する。
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { structuredPatch } from 'diff';

import { lsProjectFiles } from './git.mjs';
import { previousProjectLecture } from './lectures.mjs';
import { isTreeHidden, zipRootFor } from './naming.mjs';
import { ROOT } from './paths.mjs';

const LANG_BY_EXT = new Map([
  ['.ts', 'ts'],
  ['.tsx', 'tsx'],
  ['.js', 'js'],
  ['.mjs', 'js'],
  ['.cjs', 'js'],
  ['.json', 'json'],
  ['.yaml', 'yaml'],
  ['.yml', 'yaml'],
  ['.md', 'md'],
  ['.css', 'css'],
  ['.html', 'html'],
  ['.sh', 'sh'],
]);

const LANG_BY_NAME = new Map([
  ['Containerfile', 'dockerfile'],
  ['Dockerfile', 'dockerfile'],
  ['.containerignore', 'text'],
  ['.dockerignore', 'text'],
  ['.gitignore', 'text'],
]);

function langOf(file) {
  const base = path.posix.basename(file);
  if (LANG_BY_NAME.has(base)) return LANG_BY_NAME.get(base);
  if (base.startsWith('.env')) return 'ini';
  return LANG_BY_EXT.get(path.posix.extname(base).toLowerCase()) ?? 'text';
}

async function readOrNull(abs) {
  try {
    return await readFile(abs, 'utf8');
  } catch (e) {
    if (e.code === 'ENOENT') return null;
    throw e;
  }
}

/** 中身に ``` を含むときは、それより長いフェンスで囲む。 */
function fenceFor(lines) {
  let longest = 2;
  for (const line of lines) {
    const m = line.match(/`{3,}/g);
    if (m) for (const run of m) longest = Math.max(longest, run.length);
  }
  return '`'.repeat(longest + 1);
}

/** `<sec>/<lec>` か `sections/<sec>/<lec>` を `sections/<sec>/<lec>` にそろえる。 */
function normalizeLectureRef(ref) {
  const s = String(ref).trim().replace(/^\/+|\/+$/g, '');
  return s.startsWith('sections/') ? s : `sections/${s}`;
}

function baseLectureOf(lectureRel, from) {
  return from ? normalizeLectureRef(from) : previousProjectLecture(lectureRel);
}

/** ::diff を展開した Markdown を返す。展開できなければ null（呼び出し側が警告する）。 */
export async function buildDiffBlock({ lectureRel, attrs, label, where }) {
  const file = String(attrs.file ?? '').trim();
  if (!file || file.split('/').some((seg) => seg === '..')) {
    console.warn(`[sentinels] ::diff needs file="<path>" in ${where} (skipped)`);
    return null;
  }
  const baseRel = baseLectureOf(lectureRel, attrs.from);
  const current = await readOrNull(path.join(ROOT, ...lectureRel.split('/'), ...file.split('/')));
  const previous = baseRel
    ? await readOrNull(path.join(ROOT, ...baseRel.split('/'), ...String(attrs.fromFile ?? file).split('/')))
    : null;
  if (current === null && previous === null) {
    console.warn(`[sentinels] ::diff file not found: ${file} in ${where} (skipped)`);
    return null;
  }
  if (current === previous) {
    console.warn(`[sentinels] ::diff no changes in ${file} (${where}, skipped)`);
    return null;
  }

  const context = /^\d+$/.test(String(attrs.context ?? '')) ? Number(attrs.context) : 3;
  const patch = structuredPatch(file, file, previous ?? '', current ?? '', '', '', { context });
  const lang = langOf(file);
  const blocks = [];
  patch.hunks.forEach((hunk, i) => {
    const lines = hunk.lines.filter((l) => !l.startsWith('\\'));
    const fence = fenceFor(lines);
    const note = i === 0 && label ? `[${label}]` : '';
    // 追加だけの塊は oldStart が 0 になる。行番号は 1 から数えるのでそろえる。
    const offset = Math.max(1, hunk.oldStart);
    const newOffset = Math.max(1, hunk.newStart);
    blocks.push(
      [
        `:::code${note}{filepath="${file}" offset=${offset} newOffset=${newOffset}}`,
        fence + lang,
        ...lines,
        fence,
        ':::',
      ].join('\n'),
    );
  });
  return blocks.join('\n\n');
}

/** レクチャー相対のプロジェクトファイル一覧（ツリーに出すものだけ）。 */
async function projectFiles(lectureRel) {
  const files = await lsProjectFiles(ROOT, lectureRel);
  return files.map((f) => path.posix.relative(lectureRel, f)).filter((rel) => !isTreeHidden(rel));
}

/** パスの一覧から木構造を作る。 */
function toTree(files) {
  const root = new Map();
  for (const rel of files) {
    let node = root;
    for (const seg of rel.split('/')) {
      if (!node.has(seg)) node.set(seg, new Map());
      node = node.get(seg);
    }
  }
  return root;
}

/** ディレクトリを先に、それぞれ名前順で並べる（エディタのエクスプローラーと同じ）。 */
function sortedEntries(node) {
  return [...node.entries()].sort(([a, an], [b, bn]) => {
    const ad = an.size > 0;
    const bd = bn.size > 0;
    if (ad !== bd) return ad ? -1 : 1;
    return a.localeCompare(b);
  });
}

/** ::tree を展開した Markdown を返す。 */
export async function buildTreeBlock({ lectureRel, sec, lec, attrs }) {
  const files = await projectFiles(lectureRel);
  if (files.length === 0) return null;
  const baseRel = baseLectureOf(lectureRel, attrs.from);
  const baseFiles = baseRel ? new Set(await projectFiles(baseRel)) : new Set();

  const status = new Map();
  for (const rel of files) {
    if (!baseFiles.has(rel)) {
      status.set(rel, 'added');
      continue;
    }
    const [a, b] = await Promise.all([
      readFile(path.join(ROOT, ...lectureRel.split('/'), ...rel.split('/'))),
      readFile(path.join(ROOT, ...baseRel.split('/'), ...rel.split('/'))),
    ]);
    if (!a.equals(b)) status.set(rel, 'modified');
  }
  const currentSet = new Set(files);
  const removed = [...baseFiles].filter((rel) => !currentSet.has(rel)).sort();

  const lines = [`${zipRootFor(sec, lec)}/`];
  const ins = [];
  const mark = [];
  const walk = (node, prefix, parentRel) => {
    const entries = sortedEntries(node);
    entries.forEach(([name, child], i) => {
      const last = i === entries.length - 1;
      const rel = parentRel ? `${parentRel}/${name}` : name;
      const isDir = child.size > 0;
      let suffix = '';
      const st = status.get(rel);
      if (st === 'added') suffix = '  ← 追加';
      if (st === 'modified') suffix = '  ← 変更';
      lines.push(`${prefix}${last ? '└── ' : '├── '}${name}${isDir ? '/' : ''}${suffix}`);
      if (st === 'added') ins.push(lines.length);
      if (st === 'modified') mark.push(lines.length);
      if (isDir) walk(child, `${prefix}${last ? '    ' : '│   '}`, rel);
    });
  };
  walk(toTree(files), '', '');
  if (removed.length > 0) {
    lines.push('', '# この節で削除したファイル');
    for (const rel of removed) {
      lines.push(`- ${rel}`);
    }
  }

  const meta = [`title="${zipRootFor(sec, lec)}"`];
  if (ins.length > 0) meta.push(`ins={${ins.join(',')}}`);
  if (mark.length > 0) meta.push(`mark={${mark.join(',')}}`);
  return ['```text ' + meta.join(' '), ...lines, '```'].join('\n');
}
