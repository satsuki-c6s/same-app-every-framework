import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// 共通ファイル (../shared/app.css・../shared/repos.json) はリポジトリ直下にあり、
	// Vite の dev サーバは既定でプロジェクトより上を配信しない。
	// 全実装で同じデータ・同じ CSS を使うのがこのシリーズの前提なのでコピーせず許可する
	server: { fs: { allow: ['..'] } },
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
			// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
			// See https://svelte.dev/docs/kit/adapters for more information about adapters.
			adapter: adapter()
		})
	]
});
