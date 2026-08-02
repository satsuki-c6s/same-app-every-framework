/**
 * OSSリポジトリ ミニ検索 — Preact 版。
 *
 * 書き方はリアクトそのもの (useState / useMemo / JSX)。状態が変わるとコンポーネント
 * 関数が再実行され、仮想DOMの差分で画面を更新する — 動作原理もリアクトと同じ。
 * 違いは本体の大きさだけ。「リアクト互換を約3KBで」が Preact の売りで、
 * リアクトのコードがそのまま動くことは特徴デモ (/specialty.html) で確かめる。
 */
import { useMemo, useState } from 'preact/hooks';
import data from '../../shared/repos.json';

interface Repo {
  fullName: string;
  description: string;
  language: string;
  stars: number;
}

const repos: Repo[] = data.items;
const languages = ['All', ...new Set(repos.map((r) => r.language))];

export function App() {
  const [query, setQuery] = useState('');
  const [activeLang, setActiveLang] = useState('All');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return repos.filter((r) => {
      const hitQuery =
        q === '' || r.fullName.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
      const hitLang = activeLang === 'All' || r.language === activeLang;
      return hitQuery && hitLang;
    });
  }, [query, activeLang]);

  // Set は複製してから入れ替える (中身だけの変更は検知されない)
  const toggleFavorite = (name: string): void => {
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
        value={query}
        onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
      />
      <div class="filters">
        {languages.map((l) => (
          <button
            key={l}
            type="button"
            class={l === activeLang ? 'active' : undefined}
            onClick={() => setActiveLang(l)}
          >
            {l}
          </button>
        ))}
      </div>
      <p class="summary">
        {repos.length} 件中 {visible.length} 件を表示 ／ ★ {favorites.size}
      </p>
      <div class="list">
        {visible.length === 0 ? (
          <p class="empty">該当するリポジトリがありません</p>
        ) : (
          visible.map((r) => (
            <div class="card" key={r.fullName}>
              <div class="card-head">
                <span class="card-name">{r.fullName}</span>
                <span class="card-stars">★ {r.stars.toLocaleString('en-US')}</span>
              </div>
              <div class="card-desc">{r.description}</div>
              <div class="card-foot">
                <span class="tag">{r.language}</span>
                <button
                  type="button"
                  class={favorites.has(r.fullName) ? 'fav on' : 'fav'}
                  onClick={() => toggleFavorite(r.fullName)}
                >
                  ★ お気に入り
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
