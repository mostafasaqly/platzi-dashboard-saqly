import { Component, inject } from '@angular/core';

import { UI_PRIMENG } from '../../../../shared/ui/ui-primeng';
import { DashboardFacade } from '../../facades/dashboard.facade';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { SectionCard } from '../../../../shared/components/section-card/section-card';
import { StateCard } from '../../../../shared/components/state-card/state-card';
import {
  IMAGE_FALLBACKS,
  resolveAvatarLabel,
  resolveFirstImage,
  resolveImageUrl,
} from '../../../../shared/utils/media.util';

@Component({
  selector: 'app-dashboard-page',
  imports: [PageHeader, SectionCard, StateCard, ...UI_PRIMENG],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {
  protected readonly dashboardFacade = inject(DashboardFacade);

  protected statToneClass(tone: 'primary' | 'success' | 'warning' | 'info'): string {
    return `dashboard-stat--${tone}`;
  }

  protected productImage(productImages: string[] | null | undefined): string {
    return resolveFirstImage(productImages, IMAGE_FALLBACKS.product);
  }

  protected categoryImage(image: string | null | undefined): string {
    return resolveImageUrl(image, IMAGE_FALLBACKS.category);
  }

  protected userAvatar(avatar: string | null | undefined): string | undefined {
    const resolved = resolveImageUrl(avatar, '');
    return resolved || undefined;
  }

  protected userInitial(name: string | null | undefined): string {
    return resolveAvatarLabel(name);
  }

  protected userSeverity(
    role: string,
  ): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'danger';
      case 'customer':
        return 'success';
      default:
        return 'info';
    }
  }
  protected readonly imageFallbacks = IMAGE_FALLBACKS;

protected onImageError(event: Event, fallback: string): void {
  const element = event.target as HTMLImageElement | null;

  if (!element) {
    return;
  }

  if (!element.src.endsWith(fallback)) {
    element.src = fallback;
  }
}
}
