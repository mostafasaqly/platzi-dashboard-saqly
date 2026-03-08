import { Component, computed, inject } from '@angular/core';

import { AppPageSize } from '../../../../core/models/app-preferences.model';
import { AppPreferencesService } from '../../../../core/services/app-preferences.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { UI_PRIMENG } from '../../../../shared/ui/ui-primeng';
import { SectionCard } from "../../../../shared/components/section-card/section-card";
import { PageHeader } from "../../../../shared/components/page-header/page-header";

@Component({
  selector: 'app-settings-page',
  imports: [...UI_PRIMENG, SectionCard, PageHeader],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss',
})
export class SettingsPage {
  protected readonly preferencesService = inject(AppPreferencesService);
  protected readonly themeService = inject(ThemeService);

  protected readonly themeMode = computed(() => this.themeService.mode());
  protected readonly density = computed(() => this.preferencesService.density());
  protected readonly productsPageSize = computed(() =>
    this.preferencesService.productsPageSize()
  );

  protected readonly pageSizes: AppPageSize[] = [6, 10, 12, 20];

  protected onThemeModeChange(value: string | null): void {
    if (value === 'light' || value === 'dark') {
      this.preferencesService.setThemeMode(value);
    }
  }
  protected onDensityChange(value: string | null): void {
    if (value === 'compact' || value === 'comfortable') {
      this.preferencesService.setDensity(value);
    }
  }

  protected onPageSizeChange(value: string | number | null): void {
    const parsed = Number(value) as AppPageSize;

    if ([6, 10, 12, 20].includes(parsed)) {
      this.preferencesService.setProductsPageSize(parsed);
    }
  }
}
