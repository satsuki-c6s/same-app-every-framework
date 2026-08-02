/**
 * 特徴デモ: サーバルート。
 *
 * このファイルを server/api/ に置いただけで、GET /api/repos が生える。
 * ルータの登録も、別サーバの用意も要らない — 置き場所が API のパスになる。
 * ここはサーバ側だけで動くので、ブラウザにこのコードは送られない。
 */
import data from '../../../shared/repos.json';

export default defineEventHandler(() => ({
  items: data.items,
  // サーバ側で作った値であることが分かるように、応答時刻を入れておく
  servedAt: new Date().toISOString(),
}));
