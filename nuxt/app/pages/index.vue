<script setup lang="ts">
/**
 * OSSリポジトリ ミニ検索 — Nuxt 4 版。
 *
 * 中身は Vue 3 (Composition API) で、第2回の vue/src/App.vue とほぼ同じコード。
 * Nuxt が足すのは画面そのものではなく、その周り — ファイルを置くだけのルーティング、
 * サーバ側の処理、事前レンダリング。この共通デモではその差は見えないので、
 * 特徴デモ (/specialty) の側で見せる。
 */
import { ref, computed } from 'vue';
import data from '../../../shared/repos.json';

interface Repo {
  fullName: string;
  description: string;
  language: string;
  stars: number;
}

const repos: Repo[] = data.items;
const languages = ['All', ...new Set(repos.map((r) => r.language))];

// ---- 状態。書き換えれば画面が追従する ----
const query = ref('');
const activeLang = ref('All');
const favorites = ref(new Set<string>());

const visible = computed(() => {
  const q = query.value.trim().toLowerCase();
  return repos.filter((r) => {
    const hitQuery =
      q === '' || r.fullName.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    const hitLang = activeLang.value === 'All' || r.language === activeLang.value;
    return hitQuery && hitLang;
  });
});

function toggleFavorite(name: string): void {
  // Set は複製してから入れ替える (中身だけ書き換えると変更を検知できない)
  const next = new Set(favorites.value);
  if (next.has(name)) next.delete(name);
  else next.add(name);
  favorites.value = next;
}
</script>

<template>
  <div class="app">
    <h1>OSS リポジトリ検索</h1>
    <input class="search" type="search" placeholder="リポジトリ名・説明で検索" v-model="query" />
    <div class="filters">
      <button
        v-for="l in languages"
        :key="l"
        type="button"
        :class="{ active: l === activeLang }"
        @click="activeLang = l"
      >
        {{ l }}
      </button>
    </div>
    <p class="summary">{{ repos.length }} 件中 {{ visible.length }} 件を表示 ／ ★ {{ favorites.size }}</p>
    <div class="list">
      <div v-for="r in visible" :key="r.fullName" class="card">
        <div class="card-head">
          <span class="card-name">{{ r.fullName }}</span>
          <span class="card-stars">★ {{ r.stars.toLocaleString('en-US') }}</span>
        </div>
        <div class="card-desc">{{ r.description }}</div>
        <div class="card-foot">
          <span class="tag">{{ r.language }}</span>
          <button
            type="button"
            class="fav"
            :class="{ on: favorites.has(r.fullName) }"
            @click="toggleFavorite(r.fullName)"
          >
            ★ お気に入り
          </button>
        </div>
      </div>
      <p v-if="visible.length === 0" class="empty">該当するリポジトリがありません</p>
    </div>
  </div>
</template>
