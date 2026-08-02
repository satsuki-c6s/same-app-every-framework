import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  // 共通ファイル (../shared/*) はリポジトリ直下にあり、dev サーバは既定で
  // プロジェクトより上を配信しない。コピーせず許可する
  server: { fs: { allow: ['..'] } },
  resolve: {
    // 特徴デモ用: 'react' のまま書いたコードを Preact の互換層に振り向ける。
    // これが「React 互換」の実体 — インストールしていない react が動く
    alias: {
      react: 'preact/compat',
      'react-dom/client': 'preact/compat/client',
      'react-dom': 'preact/compat',
    },
  },
})
