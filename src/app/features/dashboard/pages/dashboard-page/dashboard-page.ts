import { Component, inject } from '@angular/core';

import { UI_PRIMENG } from '../../../../shared/ui/ui-primeng';
import { DashboardFacade } from '../../facades/dashboard.facade';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { SectionCard } from '../../../../shared/components/section-card/section-card';
import { StateCard } from '../../../../shared/components/state-card/state-card';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    PageHeader,
    SectionCard,
    StateCard,
    ...UI_PRIMENG,
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
})
export class DashboardPage {
  protected readonly dashboardFacade = inject(DashboardFacade);

  protected statToneClass(tone: 'primary' | 'success' | 'warning' | 'info'): string {
    return `dashboard-stat--${tone}`;
  }

  protected productImage(productImages: string[]): string {
    return productImages?.[0] || 'https://placehold.co/600x400?text=No+Image';
  }

  protected userSeverity(role: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'danger';
      case 'customer':
        return 'success';
      default:
        return 'info';
    }
  }
}
