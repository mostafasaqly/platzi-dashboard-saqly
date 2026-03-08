import { Injectable, computed, effect, inject, signal } from '@angular/core';

import {
  AppDensity,
  AppPageSize,
  AppPreferences,
} from '../models/app-preferences.model';
import { ThemeService } from './theme.service';

const APP_PREFERENCES_KEY = 'platzi_admin_preferences';

const DEFAULT_PREFERENCES: AppPreferences = {
  themeMode: 'light',
  density: 'comfortable',
  productsPageSize: 10,
};

@Injectable({ providedIn: 'root' })
export class AppPreferencesService {
  private readonly themeService = inject(ThemeService);

  private readonly _preferences = signal<AppPreferences>(this.readInitial());

  readonly preferences = this._preferences.asReadonly();

  readonly density = computed(() => this._preferences().density);
  readonly productsPageSize = computed(() => this._preferences().productsPageSize);

  constructor() {
    effect(() => {
      const preferences = this._preferences();
      localStorage.setItem(APP_PREFERENCES_KEY, JSON.stringify(preferences));
      this.applyDensity(preferences.density);
    });
  }

  setThemeMode(mode: 'light' | 'dark'): void {
    this._preferences.update((current) => ({ ...current, themeMode: mode }));

    if (this.themeService.mode() !== mode) {
      this.themeService.toggle();
    }
  }

  setDensity(density: AppDensity): void {
    this._preferences.update((current) => ({ ...current, density }));
  }

  setProductsPageSize(productsPageSize: AppPageSize): void {
    this._preferences.update((current) => ({ ...current, productsPageSize }));
  }

  private readInitial(): AppPreferences {
    const raw = localStorage.getItem(APP_PREFERENCES_KEY);

    if (!raw) {
      return {
        ...DEFAULT_PREFERENCES,
        themeMode: this.themeService.mode(),
      };
    }

    try {
      const parsed = JSON.parse(raw) as Partial<AppPreferences>;

      return {
        themeMode:
          parsed.themeMode === 'dark' || parsed.themeMode === 'light'
            ? parsed.themeMode
            : this.themeService.mode(),
        density:
          parsed.density === 'compact' || parsed.density === 'comfortable'
            ? parsed.density
            : DEFAULT_PREFERENCES.density,
        productsPageSize:
          parsed.productsPageSize === 6 ||
          parsed.productsPageSize === 10 ||
          parsed.productsPageSize === 12 ||
          parsed.productsPageSize === 20
            ? parsed.productsPageSize
            : DEFAULT_PREFERENCES.productsPageSize,
      };
    } catch {
      return {
        ...DEFAULT_PREFERENCES,
        themeMode: this.themeService.mode(),
      };
    }
  }

  private applyDensity(density: AppDensity): void {
    document.documentElement.classList.toggle(
      'app-density-compact',
      density === 'compact'
    );
  }
}
