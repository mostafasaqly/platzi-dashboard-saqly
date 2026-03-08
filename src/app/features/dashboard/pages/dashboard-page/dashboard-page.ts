import { Component, inject } from '@angular/core';
import { UI_PRIMENG } from '../../../../shared/ui/ui-primeng';
import { DashboardFacade } from '../../facades/dashboard.facade';
import { SectionCard } from "../../../../shared/components/section-card/section-card";
import { StateCard } from "../../../../shared/components/state-card/state-card";
import { PageHeader } from "../../../../shared/components/page-header/page-header";

@Component({
  selector: 'app-dashboard-page',
  imports: [...UI_PRIMENG, SectionCard, StateCard, PageHeader],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {
  protected readonly dashboardFacade = inject(DashboardFacade);

  protected readonly productFallback = '/product-placeholder.png';
  protected readonly categoryFallback = '/category-placeholder.png';
  protected readonly avatarFallback = '/avatar-placeholder.png';

  constructor() {
    void this.dashboardFacade.load();
  }

  protected statToneClass(
    tone: 'primary' | 'success' | 'warning' | 'info',
  ): string {
    return `dashboard-stat--${tone}`;
  }

  protected productImage(productImages: string[] | null | undefined): string {
    const firstValid = productImages?.find((image) => this.isSafeImageUrl(image));
    return firstValid || this.productFallback;
  }

  protected categoryImage(image: string | null | undefined): string {
    return this.isSafeImageUrl(image) ? image!.trim() : this.categoryFallback;
  }

  protected userAvatar(avatar: string | null | undefined): string {
    return this.isSafeImageUrl(avatar) ? avatar!.trim() : this.avatarFallback;
  }

  protected onImageError(event: Event, fallback: string): void {
    const element = event.target as HTMLImageElement | null;
    if (!element) return;

    if (element.src !== fallback) {
      element.src = fallback;
      element.onerror = null;
    }
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

  private isSafeImageUrl(url: string | null | undefined): boolean {
    if (!url?.trim()) return false;

    const value = url.trim().toLowerCase();

    if (value.includes('placeimg.com')) return false;
    if (value.includes('imgur.com/gallery/')) return false;
    if (value.includes('elcomercio.pe/resizer/')) return false;

    const isHttp = value.startsWith('http://') || value.startsWith('https://');
    const isLocal = value.startsWith('/');

    if (!isHttp && !isLocal) return false;

    return true;
  }
}
