/**
 * OSSリポジトリ ミニ検索 — Vite + 素の TypeScript 版。
 *
 * フレームワークを使わない基準実装。状態が変わるたびに何をどう描き直すかを
 * 全部自分で面倒を見る (入力欄を作り直すとフォーカスが飛ぶので、骨組みは一度だけ
 * 描いて、変わる部分だけ書き換える)。この手間こそが、以降の回でフレームワークが
 * 解決してみせる問題そのもの。
 *
 * innerHTML に流し込むのは同梱の固定データ (shared/repos.json) だけ。
 * 利用者の入力 (検索文字列) は絞り込みにしか使わず、HTML には差し込まない。
 * 外部データを扱うアプリでは、ここはサニタイズか textContent が必要になる。
 */
import '../../shared/app.css';
import data from '../../shared/repos.json';

interface Repo {
  fullName: string;
  description: string;
  language: string;
  stars: number;
}

const repos: Repo[] = data.items;
const languages = ['All', ...new Set(repos.map((r) => r.language))];

// ---- 状態 (これが変わったら update() を呼ぶ) ----
let query = '';
let activeLang = 'All';
const favorites = new Set<string>();

function visibleRepos(): Repo[] {
  const q = query.trim().toLowerCase();
  return repos.filter((r) => {
    const hitQuery =
      q === '' || r.fullName.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    const hitLang = activeLang === 'All' || r.language === activeLang;
    return hitQuery && hitLang;
  });
}

// ---- 骨組みは一度だけ描く ----
const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <div class="app">
    <h1>OSS リポジトリ検索</h1>
    <input class="search" type="search" placeholder="リポジトリ名・説明で検索" />
    <div class="filters"></div>
    <p class="summary"></p>
    <div class="list"></div>
  </div>
`;
const searchEl = app.querySelector<HTMLInputElement>('.search')!;
const filtersEl = app.querySelector<HTMLDivElement>('.filters')!;
const summaryEl = app.querySelector<HTMLParagraphElement>('.summary')!;
const listEl = app.querySelector<HTMLDivElement>('.list')!;

filtersEl.innerHTML = languages
  .map((l) => `<button type="button" data-lang="${l}">${l}</button>`)
  .join('');

// ---- 変わる部分だけ書き換える ----
function update(): void {
  const shown = visibleRepos();
  summaryEl.textContent = `${repos.length} 件中 ${shown.length} 件を表示 ／ ★ ${favorites.size}`;
  for (const b of filtersEl.querySelectorAll('button')) {
    b.classList.toggle('active', b.dataset.lang === activeLang);
  }
  listEl.innerHTML =
    shown
      .map(
        (r) => `
        <div class="card">
          <div class="card-head">
            <span class="card-name">${r.fullName}</span>
            <span class="card-stars">★ ${r.stars.toLocaleString('en-US')}</span>
          </div>
          <div class="card-desc">${r.description}</div>
          <div class="card-foot">
            <span class="tag">${r.language}</span>
            <button type="button" class="fav ${favorites.has(r.fullName) ? 'on' : ''}"
              data-repo="${r.fullName}">★ お気に入り</button>
          </div>
        </div>`,
      )
      .join('') || '<p class="empty">該当するリポジトリがありません</p>';
}

// ---- 入力に反応して状態を変える ----
searchEl.addEventListener('input', () => {
  query = searchEl.value;
  update();
});
filtersEl.addEventListener('click', (e) => {
  const lang = (e.target as HTMLElement).dataset.lang;
  if (!lang) return;
  activeLang = lang;
  update();
});
listEl.addEventListener('click', (e) => {
  const name = (e.target as HTMLElement).dataset.repo;
  if (!name) return;
  if (favorites.has(name)) favorites.delete(name);
  else favorites.add(name);
  update();
});

update();
