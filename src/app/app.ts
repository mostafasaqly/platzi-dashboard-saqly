import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { APP_SETTINGS } from './core/config/app.settings';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly settings = inject(APP_SETTINGS);
  private readonly themeService = inject(ThemeService);

  constructor() {
    effect(() => {
      document.title = this.settings.appName;
      this.themeService.mode();
    });
  }
}
