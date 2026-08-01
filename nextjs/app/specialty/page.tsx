/**
 * 特徴デモ: 事前レンダリング (Next.js が公式に掲げる売り)。
 *
 * このファイルには 'use client' が無い = サーバコンポーネント。
 * ビルド時に HTML を作り切るので、**ブラウザの JavaScript を切っても一覧が表示される**。
 * 代わりに操作 (検索・絞り込み・お気に入り) は動かない — 動かす部分だけを
 * クライアントに送る、というのが App Router の考え方。
 *
 * 共通デモ (`/`) は測定後に触っていない。こちらは測定の対象外。
 */
import data from '../../../shared/repos.json';

interface Repo {
  fullName: string;
  description: string;
  language: string;
  stars: number;
}

const repos: Repo[] = data.items;
const languages = ['All', ...new Set(repos.map((r) => r.language))];

export default function Specialty() {
  return (
    <div className="app">
      <h1>
        OSS リポジトリ検索 <span className="tag">事前レンダリング</span>
      </h1>
      <input className="search" type="search" placeholder="リポジトリ名・説明で検索" readOnly />
      <div className="filters">
        {languages.map((l) => (
          <button key={l} type="button" className={l === 'All' ? 'active' : undefined}>
            {l}
          </button>
        ))}
      </div>
      <p className="summary">
        {repos.length} 件中 {repos.length} 件を表示 ／ ★ 0
      </p>
      <div className="list">
        {repos.map((r) => (
          <div className="card" key={r.fullName}>
            <div className="card-head">
              <span className="card-name">{r.fullName}</span>
              <span className="card-stars">★ {r.stars.toLocaleString('en-US')}</span>
            </div>
            <div className="card-desc">{r.description}</div>
            <div className="card-foot">
              <span className="tag">{r.language}</span>
              <button type="button" className="fav">
                ★ お気に入り
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
