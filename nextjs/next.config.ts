import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 共通ファイル (../shared/app.css・../shared/repos.json) はリポジトリ直下にあり、
  // Turbopack は既定でプロジェクトディレクトリより上を解決しない。
  // 全実装で同じデータ・同じ CSS を使うのがこのシリーズの前提なので、
  // コピーせずルートを1つ上に広げて読む
  turbopack: { root: path.join(__dirname, '..') },
  // dev の左下に出る Next.js バッジを消す。他の実装には出ないので、
  // 出したままだと「見た目当てクイズ」が成立しない (dev 表示のみで成果物には影響しない)
  devIndicators: false,
};

export default nextConfig;
