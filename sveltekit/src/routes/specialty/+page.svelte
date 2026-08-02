<script lang="ts">
	/**
	 * 特徴デモ: フォームアクションの画面側。
	 *
	 * ★ボタンは <form method="POST"> の submit ボタン。JS を切っても素のフォーム送信で
	 * サーバが処理して再描画する。use:enhance の1属性で、JS が効く環境では
	 * ページ再読み込みなしの動作に昇格する (段階的強化)。
	 */
	import { enhance } from '$app/forms';

	let { data } = $props();
	const favorites = $derived(new Set(data.favorites));
	const languages = ['All', ...new Set(data.items.map((r: { language: string }) => r.language))];
</script>

<div class="app">
	<h1>OSS リポジトリ検索 <span class="tag">フォームアクション</span></h1>
	<input class="search" type="search" placeholder="リポジトリ名・説明で検索" readonly />
	<div class="filters">
		{#each languages as l (l)}
			<button type="button" class:active={l === 'All'}>{l}</button>
		{/each}
	</div>
	<p class="summary">{data.items.length} 件中 {data.items.length} 件を表示 ／ ★ {favorites.size}</p>
	<div class="list">
		{#each data.items as r (r.fullName)}
			<div class="card">
				<div class="card-head">
					<span class="card-name">{r.fullName}</span>
					<span class="card-stars">★ {r.stars.toLocaleString('en-US')}</span>
				</div>
				<div class="card-desc">{r.description}</div>
				<div class="card-foot">
					<span class="tag">{r.language}</span>
					<form method="POST" action="?/toggle" use:enhance>
						<input type="hidden" name="name" value={r.fullName} />
						<button type="submit" class="fav" class:on={favorites.has(r.fullName)}>
							★ お気に入り
						</button>
					</form>
				</div>
			</div>
		{/each}
	</div>
</div>
