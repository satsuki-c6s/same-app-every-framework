<script setup lang="ts">
/**
 * ルートコンポーネント。
 *
 * 特徴デモ (ファイルベースルーティング) を追加した時点で、画面の中身は
 * app/pages/ 以下に移した。ここは <NuxtPage /> を置くだけ — どのファイルが
 * どの URL になるかは Nuxt がディレクトリ構成から決める。
 *
 * 共通デモ (/) の中身は app/pages/index.vue にそのまま移してあり、測定時から変えていない。
 */
import '../../shared/app.css';
</script>

<template>
  <NuxtPage />
</template>
