<script setup lang="ts">
/**
 * 特徴デモ: Vue 3 の <TransitionGroup>。
 *
 * 共通デモと同じアプリの一覧を <TransitionGroup> で包んだだけ。絞り込みで消える項目は
 * 左へ流れながら薄くなり、残る項目は新しい位置まで滑って移動する (FLIP)。
 * アニメーションの記述は下の CSS 数行だけで、JS 側には1行も足していない —
 * これが Vue が組み込みで持つ売り。**このデモは比較対象ではない** (特徴デモ)。
 */
import { ref, computed } from 'vue';
import data from '../../shared/repos.json';

interface Repo {
  fullName: string;
  description: string;
  language: string;
  stars: number;
}

const repos: Repo[] = data.items;
const languages = ['All', ...new Set(repos.map((r) => r.language))];

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
  const next = new Set(favorites.value);
  if (next.has(name)) next.delete(name);
  else next.add(name);
  favorites.value = next;
}
</script>

<template>
  <div class="app">
    <h1>OSS リポジトリ検索 <span class="sp-badge">TransitionGroup</span></h1>
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
    <TransitionGroup name="list" tag="div" class="list sp-list">
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
    </TransitionGroup>
  </div>
</template>

<style scoped>
/* アニメーションはこれだけ。JS には1行も足していない */
.sp-badge {
  font-size: 13px;
  color: #8b949e;
  border: 1px solid #30363d;
  border-radius: 999px;
  padding: 2px 10px;
  vertical-align: middle;
}
.sp-list {
  position: relative;
}
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(40px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}
.list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
