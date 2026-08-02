<script setup lang="ts">
/**
 * 特徴デモ: ファイルベースルーティング + サーバルート (Nuxt が公式に掲げる売り)。
 *
 * このファイルを app/pages/specialty.vue に置いただけで /specialty が生え、
 * server/api/repos.get.ts を置いただけで /api/repos が生えている。
 * ルータ設定もサーバの用意も書いていない — 置き場所がそのまま URL になる。
 *
 * 一覧は共通データを直接 import せず、そのサーバルートから取ってくる。
 * 共通デモ (/) は測定後に触っていない。こちらは測定の対象外。
 */
interface Repo {
  fullName: string;
  description: string;
  language: string;
  stars: number;
}

const { data } = await useFetch<{ items: Repo[]; servedAt: string }>('/api/repos');
const repos = computed(() => data.value?.items ?? []);
const languages = computed(() => ['All', ...new Set(repos.value.map((r) => r.language))]);
</script>

<template>
  <div class="app">
    <h1>OSS リポジトリ検索 <span class="tag">/api/repos から取得</span></h1>
    <input class="search" type="search" placeholder="リポジトリ名・説明で検索" readonly />
    <div class="filters">
      <button v-for="l in languages" :key="l" type="button" :class="{ active: l === 'All' }">
        {{ l }}
      </button>
    </div>
    <p class="summary">{{ repos.length }} 件中 {{ repos.length }} 件を表示 ／ ★ 0</p>
    <div class="list">
      <div v-for="r in repos" :key="r.fullName" class="card">
        <div class="card-head">
          <span class="card-name">{{ r.fullName }}</span>
          <span class="card-stars">★ {{ r.stars.toLocaleString('en-US') }}</span>
        </div>
        <div class="card-desc">{{ r.description }}</div>
        <div class="card-foot">
          <span class="tag">{{ r.language }}</span>
          <button type="button" class="fav">★ お気に入り</button>
        </div>
      </div>
    </div>
  </div>
</template>
