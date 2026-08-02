#!/usr/bin/env bash
# 共通デモの測定。手順を固定するためのスクリプトで、**1実装につき1回だけ**実行し、
# 出力を RESULTS.md に転記する (やり直さない)。
#
#   bash scripts/measure.sh <dir> [port] [devScript]   (devScript 既定: dev。Angular は start)
#
# 測るもの:
#   install  : 依存の取得時間 (クリーンな状態から)
#   deps     : lockfile 基準の依存パッケージ数
#   build    : 本番ビルド時間 (スキャフォールドの build スクリプトのまま)
#   js gzip  : ビルド成果物の JS を gzip した合計バイト数
#   dev      : dev サーバ起動から HTTP 200 が返るまでの実測 (自己申告の "ready in" は使わない)
set -eu
dir="$1"
port="${2:-5173}"
dev_script="${3:-dev}"
cd "$(dirname "$0")/../$dir"

echo "== $dir  $(date +%F)  node $(node --version)"

# フレームワークによってビルド成果物の場所と dev の起動フラグが違う。
# 測る中身 (ブラウザに送られる JS の gzip 合計 / dev 起動から HTTP 200 まで) は変えない。
#   vite系   : dist          / npm run dev -- --port N --strictPort
#   Angular  : dist          / npm run start -- --port N
#   Next.js  : .next/static     / npm run dev -- --port N  (--strictPort は Next に無いフラグ)
#   Nuxt     : .output/public   / npm run dev -- --port N
# .next/server はブラウザに送られないので走査しない (足すと数倍に膨らむ)
if [ -f next.config.ts ] || [ -f next.config.js ] || [ -f next.config.mjs ]; then
  kind=next
  out_dir=".next/static"
  build_dirs="dist .next"
elif [ -f nuxt.config.ts ] || [ -f nuxt.config.js ]; then
  kind=nuxt
  # .output/public がブラウザに配られる側。.output/server は送られないので走査しない
  out_dir=".output/public"
  build_dirs="dist .nuxt .output"
elif [ -f astro.config.mjs ] || [ -f astro.config.ts ]; then
  # Astro: 成果物は dist (既定)。dev は astro CLI で --strictPort が無い
  kind=astro
  out_dir="dist"
  build_dirs="dist .astro"
elif grep -q '"@sveltejs/kit"' package.json 2>/dev/null; then
  # SvelteKit: dev は vite なので起動フラグは vite 系と同じ。成果物だけ場所が違う
  # (.svelte-kit/output/client がブラウザに配られる側。server は送られないので走査しない)
  kind=dev
  out_dir=".svelte-kit/output/client"
  build_dirs="dist .svelte-kit"
else
  kind="$dev_script"   # dev = vite系 / start = Angular
  out_dir="dist"
  build_dirs="dist"
fi

rm -rf node_modules $build_dirs .dev.log
t0=$(date +%s%3N)
npm install --no-fund --no-audit --loglevel=error > /dev/null
t1=$(date +%s%3N)
echo "install: $((t1 - t0)) ms"
echo "deps: $(node -e "const l=require('./package-lock.json');console.log(Object.keys(l.packages).filter(Boolean).length)") packages"

t2=$(date +%s%3N)
npm run build > /dev/null 2>&1
t3=$(date +%s%3N)
echo "build: $((t3 - t2)) ms"

total=0
for f in $(find "$out_dir" -name "*.js" -not -name "*.map" | sort); do
  s=$(gzip -c "$f" | wc -c)
  echo "js: $(basename "$f")  ${s} B (gzip)"
  total=$((total + s))
done
echo "js-total-gzip: ${total} B"

# dev サーバ: 起動コマンドを打ってから HTTP 200 が返るまでの壁時計。
# ツール自身が出す "ready in" は使わない (自己申告を測定値にしない)
t4=$(date +%s%3N)
case "$kind" in
  next|nuxt|astro) npm run dev -- --port "$port" > .dev.log 2>&1 & ;;
  dev)  npm run dev -- --port "$port" --strictPort > .dev.log 2>&1 & ;;
  *)    npm run "$dev_script" -- --port "$port" > .dev.log 2>&1 & ;;
esac
npm_pid=$!
ok=0
for _ in $(seq 1 300); do
  if curl -s -o /dev/null "http://localhost:$port/"; then ok=1; break; fi
  sleep 0.1
done
t5=$(date +%s%3N)
if [ "$ok" = 1 ]; then
  echo "dev-until-http200: $((t5 - t4)) ms"
else
  echo "dev: 30秒以内に応答なし (失敗として記録)"
fi

# 後始末。このリポジトリのパスを含む node だけを落とす (他プロジェクトの node に触れない)
kill "$npm_pid" 2> /dev/null || true
powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { \$_.CommandLine -match 'same-app-every-framework' } | ForEach-Object { Stop-Process -Id \$_.ProcessId -Force }" > /dev/null 2>&1 || true
rm -f .dev.log
echo "== done"
