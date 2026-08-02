/**
 * OSSリポジトリ ミニ検索 — Solid 版。
 *
 * 書き味はリアクトに似た JSX だが、中身は別物。コンポーネント関数は**最初に1回しか
 * 実行されない**。createSignal の値が変わると、仮想DOMの差分計算ではなく、
 * その値を使っている DOM のその場所だけが直接更新される (細粒度更新)。
 * その様子は特徴デモ (/specialty.html) で実測する。
 */
import { createSignal, createMemo, For, Show, type Component } from 'solid-js';
import data from '../../shared/repos.json';

interface Repo {
  fullName: string;
  description: string;
  language: string;
  stars: number;
}

const repos: Repo[] = data.items;
const languages = ['All', ...new Set(repos.map((r) => r.language))];

const App: Component = () => {
  // ---- 状態 (シグナル)。set すると使用箇所だけが更新される ----
  const [query, setQuery] = createSignal('');
  const [activeLang, setActiveLang] = createSignal('All');
  const [favorites, setFavorites] = createSignal(new Set<string>());

  const visible = createMemo(() => {
    const q = query().trim().toLowerCase();
    return repos.filter((r) => {
      const hitQuery =
        q === '' || r.fullName.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
      const hitLang = activeLang() === 'All' || r.language === activeLang();
      return hitQuery && hitLang;
    });
  });

  const toggleFavorite = (name: string): void => {
    // Set は複製してから入れ替える (中身だけの変更は検知されない)
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div class="app">
      <h1>OSS リポジトリ検索</h1>
      <input
        class="search"
        type="search"
        placeholder="リポジトリ名・説明で検索"
        value={query()}
        onInput={(e) => setQuery(e.currentTarget.value)}
      />
      <div class="filters">
        <For each={languages}>
          {(l) => (
            <button
              type="button"
              classList={{ active: l === activeLang() }}
              onClick={() => setActiveLang(l)}
            >
              {l}
            </button>
          )}
        </For>
      </div>
      <p class="summary">
        {repos.length} 件中 {visible().length} 件を表示 ／ ★ {favorites().size}
      </p>
      <div class="list">
        <For each={visible()}>
          {(r) => (
            <div class="card">
              <div class="card-head">
                <span class="card-name">{r.fullName}</span>
                <span class="card-stars">★ {r.stars.toLocaleString('en-US')}</span>
              </div>
              <div class="card-desc">{r.description}</div>
              <div class="card-foot">
                <span class="tag">{r.language}</span>
                <button
                  type="button"
                  class="fav"
                  classList={{ on: favorites().has(r.fullName) }}
                  onClick={() => toggleFavorite(r.fullName)}
                >
                  ★ お気に入り
                </button>
              </div>
            </div>
          )}
        </For>
        <Show when={visible().length === 0}>
          <p class="empty">該当するリポジトリがありません</p>
        </Show>
      </div>
    </div>
  );
};

export default App;
