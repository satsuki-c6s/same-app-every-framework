import type { Metadata } from 'next';
// 共通スタイル。実装ごとに見た目を変えないための正本 (雛形の globals.css は使わない)。
// 雛形が入れる next/font (Geist) も外してある — 書体が変わるとピクセル同一でなくなる
import '../../shared/app.css';

export const metadata: Metadata = {
  title: 'OSS リポジトリ検索 — Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
