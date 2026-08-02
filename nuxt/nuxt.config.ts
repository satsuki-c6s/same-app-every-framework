// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  // 雛形の既定は true。dev の画面下に Nuxt DevTools のバッジが出るが、
  // 他の実装には出ないので、出したままだと「見た目当てクイズ」が成立しない
  devtools: { enabled: false },
  vite: {
    // 共通ファイル (../shared/app.css・../shared/repos.json) はリポジトリ直下にあり、
    // Vite の dev サーバは既定でプロジェクトより上のファイルを配信しない。
    // 全実装で同じデータ・同じ CSS を使うのがこのシリーズの前提なのでコピーせず許可する
    server: { fs: { allow: ['..'] } },
  },
})
