import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';

import { APP_SETTINGS } from './core/config/app.settings';
import { ThemeService } from './core/services/theme.service';
import { AuthFacade } from './features/auth/facades/auth.facade';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, ConfirmDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly settings = inject(APP_SETTINGS);
  private readonly themeService = inject(ThemeService);
  private readonly authFacade = inject(AuthFacade);

  constructor() {
    effect(() => {
      document.title = this.settings.appName;
      this.themeService.mode();
    });

    this.authFacade.initialize();
  }
}
