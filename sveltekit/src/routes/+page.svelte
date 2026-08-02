<script lang="ts">
	/**
	 * OSSリポジトリ ミニ検索 — SvelteKit 版。
	 *
	 * 中身は第4回の svelte/src/App.svelte とほぼ同じ Svelte 5 (runes)。
	 * SvelteKit が足すのは画面そのものではなく、その周り — ファイルベースルーティング、
	 * サーバ側の処理、フォームアクション。この共通デモではその差は見えないので、
	 * 特徴デモ (/specialty) の側で見せる。
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

	// ---- 状態。代入すれば画面が追従する ----
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
		// Set は複製してから入れ替える (中身だけの変更は検知されない)
		const next = new Set(favorites);
		if (next.has(name)) next.delete(name);
		else next.add(name);
		favorites = next;
	}
</script>

<div class="app">
	<h1>OSS リポジトリ検索</h1>
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
						class:on={favorites.has(r.fullName)}
						onclick={() => toggleFavorite(r.fullName)}
					>
						★ お気に入り
					</button>
				</div>
			</div>
		{:else}
			<p class="empty">該当するリポジトリがありません</p>
		{/each}
	</div>
</div>
