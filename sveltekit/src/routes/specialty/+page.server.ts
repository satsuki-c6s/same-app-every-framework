/**
 * 特徴デモ: フォームアクション (SvelteKit が公式に掲げる売り)。
 *
 * お気に入りの付け外しを <form method="POST"> のサーバ処理として実装する。
 * だから**ブラウザの JavaScript を切っても★ボタンが機能する** (素のフォーム送信で
 * サーバが処理して再描画する)。JS が効く環境では use:enhance が同じフォームを
 * ページ再読み込みなしに昇格させる — これが「段階的強化」。
 *
 * お気に入りは Cookie に保存する (デモなので DB は使わない)。
 * 共通デモ (/) は測定後に触っていない。こちらは測定の対象外。
 */
import type { Actions, PageServerLoad } from './$types';
import data from '../../../../shared/repos.json';

const COOKIE = 'favs';

function parseFavs(raw: string | undefined): Set<string> {
  if (!raw) return new Set();
  return new Set(raw.split(',').filter(Boolean).map(decodeURIComponent));
}

export const load: PageServerLoad = ({ cookies }) => ({
  items: data.items,
  favorites: [...parseFavs(cookies.get(COOKIE))],
});

export const actions: Actions = {
  toggle: async ({ request, cookies }) => {
    const form = await request.formData();
    const name = String(form.get('name') ?? '');
    if (!name) return { ok: false };
    const favs = parseFavs(cookies.get(COOKIE));
    if (favs.has(name)) favs.delete(name);
    else favs.add(name);
    cookies.set(COOKIE, [...favs].map(encodeURIComponent).join(','), { path: '/specialty' });
    return { ok: true };
  },
};
