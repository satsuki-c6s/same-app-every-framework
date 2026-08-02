/**
 * 特徴デモ: React 互換 (Preact が公式に掲げる売り)。
 *
 * このファイルは **React の作法のまま**書いてある — import 元は 'react'、
 * 属性は className、イベントは onChange。しかしこのプロジェクトに react は
 * インストールされていない。vite.config.ts の alias が 'react' を preact/compat に
 * 振り向けるので、このコードがそのまま Preact の上で動く。
 * 共通デモ (src/app.tsx) は測定後に触っていない。こちらは測定の対象外。
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

export function ReactApp() {
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
      <h1>
        OSS リポジトリ検索 <span className="tag">Reactのコードのまま動作中</span>
      </h1>
      <input
        className="search"
        type="search"
        placeholder="リポジトリ名・説明で検索"
        value={query}
        onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
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
        {visible.map((r) => (
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
        ))}
      </div>
    </div>
  );
}
