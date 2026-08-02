/**
 * 特徴デモ: コンテンツコレクションの定義。
 * src/posts/ に置いた Markdown が、型チェック付きのデータ集合になる。
 * frontmatter の形は schema で宣言する — 欠けや型違いはビルドエラーで止まる。
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/posts' }),
	schema: z.object({
		title: z.string(),
		summary: z.string(),
		date: z.string(),
	}),
});

export const collections = { posts };
