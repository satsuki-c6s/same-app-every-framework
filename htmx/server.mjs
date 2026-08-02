/**
 * OSSリポジトリ ミニ検索 — htmx 版。
 *
 * この回は作りが根本から違う。**自分で書くブラウザ用 JavaScript は 0 行**。
 * 検索・絞り込み・お気に入りはすべて HTML の属性 (hx-get / hx-post) で宣言し、
 * htmx がサーバへ往復して、サーバが返す **HTML の断片**で画面を入れ替える。
 * サーバは JSON ではなく HTML を返す — それがこの方式の本体なので、
 * このファイル (Node 標準ライブラリだけの小さなサーバ) が実装のすべてになる。
 *
 * 状態の置き場所も逆転する: 検索語と言語は URL のパラメータ、お気に入りはサーバ側。
 * ブラウザ側に状態を持たないから、ブラウザ側のコードが要らない。
 */
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';

const PORT = Number(process.env.PORT ?? 4321);
const repos = JSON.parse(readFileSync(new URL('../shared/repos.json', import.meta.url), 'utf8')).items;
const appCss = readFileSync(new URL('../shared/app.css', import.meta.url));
const htmxJs = readFileSync(new URL('./node_modules/htmx.org/dist/htmx.min.js', import.meta.url));
const languages = ['All', ...new Set(repos.map((r) => r.language))];

/** お気に入り (デモなのでサーバのメモリに持つ。再起動で消える)。 */
const favorites = new Set();

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function visibleRepos(q, lang) {
  const query = q.trim().toLowerCase();
  return repos.filter((r) => {
    const hitQuery =
      query === '' ||
      r.fullName.toLowerCase().includes(query) ||
      r.description.toLowerCase().includes(query);
    const hitLang = lang === 'All' || r.language === lang;
    return hitQuery && hitLang;
  });
}

/** #results の中身 (絞り込みボタン・件数・一覧)。サーバはこの HTML を返すだけ。 */
function resultsFragment(q, lang) {
  const shown = visibleRepos(q, lang);
  const filters = languages
    .map(
      (l) =>
        `<button type="button" class="${l === lang ? 'active' : ''}"
          hx-get="/list?lang=${encodeURIComponent(l)}" hx-include="[name='q']"
          hx-target="#results">${esc(l)}</button>`,
    )
    .join('');
  const cards =
    shown
      .map(
        (r) => `
        <div class="card">
          <div class="card-head">
            <span class="card-name">${esc(r.fullName)}</span>
            <span class="card-stars">★ ${r.stars.toLocaleString('en-US')}</span>
          </div>
          <div class="card-desc">${esc(r.description)}</div>
          <div class="card-foot">
            <span class="tag">${esc(r.language)}</span>
            <button type="button" class="fav ${favorites.has(r.fullName) ? 'on' : ''}"
              hx-post="/fav?repo=${encodeURIComponent(r.fullName)}"
              hx-include="[name='q'],[name='lang']" hx-target="#results">★ お気に入り</button>
          </div>
        </div>`,
      )
      .join('') || '<p class="empty">該当するリポジトリがありません</p>';
  return `
    <input type="hidden" name="lang" value="${esc(lang)}" />
    <div class="filters">${filters}</div>
    <p class="summary">${repos.length} 件中 ${shown.length} 件を表示 ／ ★ ${favorites.size}</p>
    <div class="list">${cards}</div>`;
}

function page() {
  return `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>OSS リポジトリ検索 — htmx</title>
    <link rel="stylesheet" href="/app.css" />
    <script src="/htmx.min.js"></script>
  </head>
  <body>
    <div class="app">
      <h1>OSS リポジトリ検索</h1>
      <input class="search" type="search" name="q" placeholder="リポジトリ名・説明で検索"
        hx-get="/list" hx-trigger="input changed delay:150ms" hx-include="[name='lang']"
        hx-target="#results" />
      <div id="results">${resultsFragment('', 'All')}</div>
    </div>
  </body>
</html>`;
}

/** 特徴デモ: サーバが返す「HTML の断片」をそのまま見せるページ (JS ゼロ)。 */
function specialtyPage() {
  const fragment = resultsFragment('vue', 'TypeScript');
  return `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>サーバが返すもの — htmx</title>
    <link rel="stylesheet" href="/app.css" />
  </head>
  <body>
    <div class="app">
      <h1>サーバが返すもの <span class="tag">JSONではなくHTML</span></h1>
      <p class="summary">GET /list?q=vue&amp;lang=TypeScript への応答そのもの (抜粋)</p>
      <div class="card"><pre style="margin:0;white-space:pre-wrap;font-size:26px;line-height:1.5;color:#7ee787">${esc(
        fragment.trim().slice(0, 1200),
      )}</pre></div>
    </div>
  </body>
</html>`;
}

async function readBody(req) {
  let data = '';
  for await (const chunk of req) data += chunk;
  return new URLSearchParams(data);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  const send = (body, type = 'text/html; charset=utf-8') => {
    res.writeHead(200, { 'Content-Type': type });
    res.end(body);
  };

  if (url.pathname === '/') return send(page());
  if (url.pathname === '/specialty') return send(specialtyPage());
  if (url.pathname === '/app.css') return send(appCss, 'text/css');
  if (url.pathname === '/htmx.min.js') return send(htmxJs, 'text/javascript');
  if (url.pathname === '/list') {
    const q = url.searchParams.get('q') ?? '';
    const lang = url.searchParams.get('lang') ?? 'All';
    return send(resultsFragment(q, lang));
  }
  if (url.pathname === '/fav' && req.method === 'POST') {
    const body = await readBody(req);
    const name = url.searchParams.get('repo') ?? '';
    if (favorites.has(name)) favorites.delete(name);
    else if (name) favorites.add(name);
    const q = body.get('q') ?? '';
    const lang = body.get('lang') ?? 'All';
    return send(resultsFragment(q, lang));
  }
  res.writeHead(404);
  res.end('not found');
});

server.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}/`);
});
