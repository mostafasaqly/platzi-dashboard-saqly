import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { ThemeService } from '../../services/theme.service';
import { UI_PRIMENG } from '../../../shared/ui/ui-primeng';
import { AuthFacade } from '../../../features/auth/facades/auth.facade';

@Component({
  selector: 'app-topbar',
  imports: [...UI_PRIMENG],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  protected readonly themeService = inject(ThemeService);
  protected readonly authFacade = inject(AuthFacade);

  private readonly router = inject(Router);

  async onLogout(): Promise<void> {
    await this.authFacade.logout(true);
  }

  async goToSettings(): Promise<void> {
    await this.router.navigateByUrl('/settings');
  }
}
