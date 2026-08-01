<script lang="ts">
  /**
   * 特徴デモ: Svelte の組み込みモーション (animate:flip + transition:fly)。
   *
   * 共通デモと同じ一覧に、テンプレート側の属性を2つ足しただけ。絞り込みで消える項目は
   * 左へ飛びながら消え、残る項目は新しい位置まで滑って詰まる。JS のロジックは1行も
   * 足していない — トランジションが言語機能として組み込まれているのが公式の売り。
   * **このデモは比較対象ではない** (特徴デモ)。
   */
  import { flip } from 'svelte/animate';
  import { fly } from 'svelte/transition';
  import data from '../../shared/repos.json';

  interface Repo {
    fullName: string;
    description: string;
    language: string;
    stars: number;
  }

  const repos: Repo[] = data.items;
  const languages = ['All', ...new Set(repos.map((r) => r.language))];

  let query = $state('');
  let activeLang = $state('All');
  let favorites = $state(new Set<string>());

  const visible = $derived.by(() => {
    const q = query.trim().toLowerCase();
    return repos.filter((r) => {
      const hitQuery =
        q === '' || r.fullName.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
      const hitLang = activeLang === 'All' || r.language === activeLang;
      return hitQuery && hitLang;
    });
  });

  function toggleFavorite(name: string): void {
    const next = new Set(favorites);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    favorites = next;
  }
</script>

<div class="app">
  <h1>OSS リポジトリ検索 <span class="tag">animate:flip</span></h1>
  <input class="search" type="search" placeholder="リポジトリ名・説明で検索" bind:value={query} />
  <div class="filters">
    {#each languages as l (l)}
      <button type="button" class:active={l === activeLang} onclick={() => (activeLang = l)}>
        {l}
      </button>
    {/each}
  </div>
  <p class="summary">{repos.length} 件中 {visible.length} 件を表示 ／ ★ {favorites.size}</p>
  <div class="list">
    {#each visible as r (r.fullName)}
      <div class="card" animate:flip={{ duration: 500 }} transition:fly={{ x: -40, duration: 500 }}>
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
            class:on={favorites.has(r.fullName)}
            onclick={() => toggleFavorite(r.fullName)}
          >
            ★ お気に入り
          </button>
        </div>
      </div>
    {/each}
  </div>
</div>
