/**
 * 静的ファイルを配るだけのサーバ (Alpine.js 版)。
 *
 * htmx の回 (server.mjs がアプリ本体) と違い、こちらのサーバはただの置き場。
 * アプリの中身は index.html の属性 (x-data / x-model / x-for) に全部書いてある。
 * 共通データは /repos.js として配る (shared/repos.json を const に変換するだけ —
 * ロジックは入れない。データの置き場所を揃えるための変換)。
 */
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';

const PORT = Number(process.env.PORT ?? 4321);
const indexHtml = readFileSync(new URL('./index.html', import.meta.url));
const specialtyHtml = readFileSync(new URL('./specialty.html', import.meta.url));
const appCss = readFileSync(new URL('../shared/app.css', import.meta.url));
const alpineJs = readFileSync(new URL('./node_modules/alpinejs/dist/cdn.min.js', import.meta.url));
const reposJs =
  'const REPOS = ' +
  JSON.stringify(
    JSON.parse(readFileSync(new URL('../shared/repos.json', import.meta.url), 'utf8')).items,
  ) +
  ';\n';

const routes = new Map([
  ['/', [indexHtml, 'text/html; charset=utf-8']],
  ['/specialty', [specialtyHtml, 'text/html; charset=utf-8']],
  ['/app.css', [appCss, 'text/css']],
  ['/alpine.min.js', [alpineJs, 'text/javascript']],
  ['/repos.js', [reposJs, 'text/javascript']],
]);

createServer((req, res) => {
  const hit = routes.get(new URL(req.url ?? '/', `http://localhost:${PORT}`).pathname);
  if (!hit) {
    res.writeHead(404);
    return res.end('not found');
  }
  res.writeHead(200, { 'Content-Type': hit[1] });
  res.end(hit[0]);
}).listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}/`);
});
