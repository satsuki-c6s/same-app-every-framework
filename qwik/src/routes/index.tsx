/**
 * OSSリポジトリ ミニ検索 — Qwik 版。
 *
 * 書き味はリアクト系の JSX だが、実行モデルが違う。サーバ側で描いた HTML を
 * ブラウザで「再開」し、操作のためのコードは**最初のクリックの瞬間に**必要な分だけ
 * 取りに行く (resumability + 遅延読み込み)。初回表示で読む JS がほぼ無いことは
 * 特徴デモで実測する。
 */
import { component$, useComputed$, useSignal, useStore } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import data from "../../../shared/repos.json";

interface Repo {
  fullName: string;
  description: string;
  language: string;
  stars: number;
}

const repos: Repo[] = data.items;
const languages = ["All", ...new Set(repos.map((r) => r.language))];

export default component$(() => {
  const query = useSignal("");
  const activeLang = useSignal("All");
  // Qwik のストアは直接置き換え可能な形にする (配列を入れ替えるだけ)
  const favorites = useStore<{ names: string[] }>({ names: [] });

  const visible = useComputed$(() => {
    const q = query.value.trim().toLowerCase();
    return repos.filter((r) => {
      const hitQuery =
        q === "" ||
        r.fullName.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q);
      const hitLang = activeLang.value === "All" || r.language === activeLang.value;
      return hitQuery && hitLang;
    });
  });

  return (
    <div class="app">
      <h1>OSS リポジトリ検索</h1>
      <input
        class="search"
        type="search"
        placeholder="リポジトリ名・説明で検索"
        value={query.value}
        onInput$={(_, el) => (query.value = el.value)}
      />
      <div class="filters">
        {languages.map((l) => (
          <button
            key={l}
            type="button"
            class={{ active: l === activeLang.value }}
            onClick$={() => (activeLang.value = l)}
          >
            {l}
          </button>
        ))}
      </div>
      <p class="summary">
        {repos.length} 件中 {visible.value.length} 件を表示 ／ ★ {favorites.names.length}
      </p>
      <div class="list">
        {visible.value.length === 0 ? (
          <p class="empty">該当するリポジトリがありません</p>
        ) : (
          visible.value.map((r) => (
            <div class="card" key={r.fullName}>
              <div class="card-head">
                <span class="card-name">{r.fullName}</span>
                <span class="card-stars">★ {r.stars.toLocaleString("en-US")}</span>
              </div>
              <div class="card-desc">{r.description}</div>
              <div class="card-foot">
                <span class="tag">{r.language}</span>
                <button
                  type="button"
                  class={{ fav: true, on: favorites.names.includes(r.fullName) }}
                  onClick$={() => {
                    favorites.names = favorites.names.includes(r.fullName)
                      ? favorites.names.filter((x) => x !== r.fullName)
                      : [...favorites.names, r.fullName];
                  }}
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
});

export const head: DocumentHead = {
  title: "OSS リポジトリ検索 — Qwik",
};
