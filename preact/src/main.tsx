import { render } from 'preact';
// 共通スタイル。実装ごとに見た目を変えないための正本 (雛形の index.css は使わない)
import '../../shared/app.css';
import { App } from './app.tsx';

render(<App />, document.getElementById('app')!);
