<script lang="ts">
	// 共通スタイル。実装ごとに見た目を変えないための正本
	import '../../../shared/app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
