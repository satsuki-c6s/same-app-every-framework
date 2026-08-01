/**
 * 特徴デモ: Angular の型付きリアクティブフォーム。
 *
 * フォームの形をクラス側で型ごと定義し、検証ルール (必須・形式・最小値) を宣言する。
 * 入力のたびに検証が走り、エラーは即座に画面へ出る。送信ボタンは valid になるまで無効。
 * この「フォームと検証が型で守られる」のが公式が掲げる売り。
 * **このデモは比較対象ではない** (特徴デモ)。
 */
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface Registered {
  fullName: string;
  stars: number;
  language: string;
}

@Component({
  selector: 'app-specialty',
  imports: [ReactiveFormsModule],
  templateUrl: './specialty.html',
})
export class Specialty {
  protected readonly languages = ['TypeScript', 'JavaScript', 'Rust', 'Python', 'Go'];
  protected readonly registered = signal<Registered[]>([]);

  // 型付きフォーム: 値の型・必須・形式・最小値をここで宣言する
  protected readonly form = new FormGroup({
    fullName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[\w.-]+\/[\w.-]+$/)],
    }),
    stars: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    language: new FormControl('TypeScript', { nonNullable: true }),
  });

  protected submit(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.registered.update((prev) => [...prev, v]);
    this.form.reset({ fullName: '', stars: 0, language: 'TypeScript' });
  }
}
