import { DOCUMENT } from '@angular/common';
import { Injectable, effect, inject, signal } from '@angular/core';

export type AppThemeMode = 'light' | 'dark';

const THEME_KEY = 'platzi_admin_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  private readonly _mode = signal<AppThemeMode>(
    (localStorage.getItem(THEME_KEY) as AppThemeMode | null) ?? 'light'
  );

  readonly mode = this._mode.asReadonly();

  constructor() {
    effect(() => {
      const mode = this._mode();
      this.document.documentElement.classList.toggle('app-dark', mode === 'dark');
      localStorage.setItem(THEME_KEY, mode);
    });
  }

  toggle(): void {
    this._mode.update((value) => (value === 'light' ? 'dark' : 'light'));
  }
}
