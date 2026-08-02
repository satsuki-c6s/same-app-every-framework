// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// 共通ファイル (../shared/app.css・../shared/repos.json) はリポジトリ直下にあり、
	// dev サーバ (Vite) は既定でプロジェクトより上を配信しない。
	// 全実装で同じデータ・同じ CSS を使うのがこのシリーズの前提なのでコピーせず許可する
	vite: { server: { fs: { allow: ['..'] } } },
	// dev の画面下に出るツールバーを消す。他の実装には出ないので、
	// 出したままだと「見た目当てクイズ」が成立しない (dev 表示のみで成果物には影響しない)
	devToolbar: { enabled: false },
});
