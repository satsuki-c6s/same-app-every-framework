/**
 * 特徴デモのエントリ。ここも React の作法のまま —
 * react-dom/client 由来の createRoot で描画する (実体は preact/compat/client)。
 */
import { createRoot } from 'react-dom/client';
import '../../shared/app.css';
import { ReactApp } from './react-app';

createRoot(document.getElementById('root')!).render(<ReactApp />);
