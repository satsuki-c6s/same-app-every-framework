/**
 * OSSリポジトリ ミニ検索 — Angular (standalone + signals) 版。
 *
 * Vue 版と同じく「画面更新を書かない」。signal に置いた状態が変わると、
 * テンプレートの該当箇所が追従する。書き味の違いは、すべてがクラスの
 * 枠組みに乗ること — 型と規約が最初から強制されるのが Angular 流。
 */
import { Component, computed, signal } from '@angular/core';
import data from '../../../shared/repos.json';

interface Repo {
  fullName: string;
  description: string;
  language: string;
  stars: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
})
export class App {
  protected readonly repos: Repo[] = data.items;
  protected readonly languages = ['All', ...new Set(this.repos.map((r) => r.language))];

  // ---- 状態。set/update すれば画面が追従する ----
  protected readonly query = signal('');
  protected readonly activeLang = signal('All');
  protected readonly favorites = signal(new Set<string>());

  protected readonly visible = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.repos.filter((r) => {
      const hitQuery =
        q === '' || r.fullName.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
      const hitLang = this.activeLang() === 'All' || r.language === this.activeLang();
      return hitQuery && hitLang;
    });
  });

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected toggleFavorite(name: string): void {
    // Set は複製してから入れ替える (中身だけの変更は検知されない)
    this.favorites.update((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }
}
