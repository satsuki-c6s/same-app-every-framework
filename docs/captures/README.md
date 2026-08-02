# スクリーンキャプチャ集

動画で使った実物のキャプチャです。すべて実際に動かした画面 (1440x900・実ブラウザ)。

- `initial.png` — 共通デモの初期表示。**全実装でピクセル単位に同じ**になるのが仕様です
- `ops.png` — 共通の操作後 (検索「vue」+ TypeScript 絞り込み + お気に入り1件)。これも全実装で同じ
- その他 — 各回の特徴デモ。`demo.gif` はアニメーションの録画 (元動画は同じフォルダの `demo.mp4`)

initial / ops が全フォルダで同じに見えるのは手抜きではなく、**条件を揃えた証明**です
(共通CSS・共通データ。違いはコードと転送量に出る)。

## 第1回 Vite

| 初期表示 | 操作後 |
|---|---|
| ![initial](./vite/initial.png) | ![ops](./vite/ops.png) |

特徴デモ: HMR (編集前後)

| 編集前 | 編集後 (リロードなしで反映) |
|---|---|
| ![before](./vite/hmr-before.png) | ![after](./vite/hmr-after.png) |

## 第2回 Vue 3

| 初期表示 | 操作後 |
|---|---|
| ![initial](./vue/initial.png) | ![ops](./vue/ops.png) |

特徴デモ: `<TransitionGroup>` によるリストアニメーション ([mp4](./vue/demo.mp4))

![demo](./vue/demo.gif)

## 第3回 Angular

| 初期表示 | 操作後 |
|---|---|
| ![initial](./angular/initial.png) | ![ops](./angular/ops.png) |

特徴デモ: リアクティブフォーム

![form](./angular/form.png)

## 第4回 Svelte

| 初期表示 | 操作後 |
|---|---|
| ![initial](./svelte/initial.png) | ![ops](./svelte/ops.png) |

特徴デモ: 組み込みトランジション ([mp4](./svelte/demo.mp4))

![demo](./svelte/demo.gif)

## 第5回 Next.js

| 初期表示 | 操作後 |
|---|---|
| ![initial](./nextjs/initial.png) | ![ops](./nextjs/ops.png) |

特徴デモ: サーバコンポーネント (JavaScript を切っても本文が表示される)

![nojs](./nextjs/nojs.png)

## 第6回 Nuxt

| 初期表示 | 操作後 |
|---|---|
| ![initial](./nuxt/initial.png) | ![ops](./nuxt/ops.png) |

特徴デモ: `server/api` によるサーバルート

![api](./nuxt/api.png)

## 第7回 SvelteKit

| 初期表示 | 操作後 |
|---|---|
| ![initial](./sveltekit/initial.png) | ![ops](./sveltekit/ops.png) |

特徴デモ: フォームアクション (JavaScript を切っても動く)

| JS off・送信前 | JS off・送信後 |
|---|---|
| ![before](./sveltekit/nojs-before.png) | ![after](./sveltekit/nojs-after.png) |

## 第8回 Astro

| 初期表示 | 操作後 |
|---|---|
| ![initial](./astro/initial.png) | ![ops](./astro/ops.png) |

特徴デモ: コンテンツコレクション (Markdown 記事一覧・JS ゼロ)

![posts](./astro/posts.png)

## 第9回 htmx

| 初期表示 | 操作後 |
|---|---|
| ![initial](./htmx/initial.png) | ![ops](./htmx/ops.png) |

特徴デモ: サーバが返す HTML 断片そのもの

![fragment](./htmx/fragment.png)

## 第10回 Alpine.js

| 初期表示 | 操作後 |
|---|---|
| ![initial](./alpine/initial.png) | ![ops](./alpine/ops.png) |

特徴デモ: HTML 属性だけで書いた FAQ アコーディオン

![faq](./alpine/faq.png)

## 第11回 SolidJS

| 初期表示 | 操作後 |
|---|---|
| ![initial](./solid/initial.png) | ![ops](./solid/ops.png) |

特徴デモ: 400セルの時計グリッド (コンポーネント再実行なしで毎秒更新 / [mp4](./solid/demo.mp4))

![demo](./solid/demo.gif)

## 第12回 Qwik

| 初期表示 | 操作後 |
|---|---|
| ![initial](./qwik/initial.png) | ![ops](./qwik/ops.png) |

特徴デモ: 3つのタイミング (表示の瞬間 / 暇な時間 / クリックの瞬間) で届いた JS の実測

![network](./qwik/network.png)

## 第13回 Preact

| 初期表示 | 操作後 |
|---|---|
| ![initial](./preact/initial.png) | ![ops](./preact/ops.png) |

特徴デモ: React 互換 — react 未インストールのまま `import ... from 'react'` のコードが動作

![react-compat](./preact/react-compat.png)
