import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';

// /specialty のときだけ特徴デモ (型付きリアクティブフォーム) を起動する。
// 動的 import なので、特徴デモのコードは共通デモのチャンクに混ざらない。
// ※特徴デモは測定後に追加した。測定値は追加前のものが正 (RESULTS.md 参照)
const entry = location.pathname.startsWith('/specialty')
  ? import('./app/specialty').then((m) => m.Specialty)
  : import('./app/app').then((m) => m.App);

entry
  .then((component) => bootstrapApplication(component, appConfig))
  .catch((err) => console.error(err));
