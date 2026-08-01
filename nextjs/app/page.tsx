'use client';

/**
 * OSSリポジトリ ミニ検索 — Next.js (App Router) 版。
 *
 * 中身は React。状態を書き換えると画面が追従する点は Vue/Svelte と同じで、
 * Next.js が足すのは「どこで実行するか」の枠組み (サーバで先に描く / クライアントで動かす)。
 * この共通デモは操作が要るので 'use client' を付けたクライアントコンポーネントにしている。
 */
import { useMemo, useState } from 'react';
import data from '../../shared/repos.json';

interface Repo {
  fullName: string;
  description: string;
  language: string;
  stars: number;
}

const repos: Repo[] = data.items;
const languages = ['All', ...new Set(repos.map((r) => r.language))];

export default function Home() {
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
    <div className="app">
      <h1>OSS リポジトリ検索</h1>
      <input
        className="search"
        type="search"
        placeholder="リポジトリ名・説明で検索"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="filters">
        {languages.map((l) => (
          <button
            key={l}
            type="button"
            className={l === activeLang ? 'active' : undefined}
            onClick={() => setActiveLang(l)}
          >
            {l}
          </button>
        ))}
      </div>
      <p className="summary">
        {repos.length} 件中 {visible.length} 件を表示 ／ ★ {favorites.size}
      </p>
      <div className="list">
        {visible.length === 0 ? (
          <p className="empty">該当するリポジトリがありません</p>
        ) : (
          visible.map((r) => (
            <div className="card" key={r.fullName}>
              <div className="card-head">
                <span className="card-name">{r.fullName}</span>
                <span className="card-stars">★ {r.stars.toLocaleString('en-US')}</span>
              </div>
              <div className="card-desc">{r.description}</div>
              <div className="card-foot">
                <span className="tag">{r.language}</span>
                <button
                  type="button"
                  className={favorites.has(r.fullName) ? 'fav on' : 'fav'}
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
