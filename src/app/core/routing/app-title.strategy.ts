import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { APP_SETTINGS } from '../config/app.settings';

@Injectable()
export class AppTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly settings = inject(APP_SETTINGS);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const routeTitle = this.buildTitle(snapshot);

    if (!routeTitle) {
      this.title.setTitle(this.settings.appName);
      return;
    }

    this.title.setTitle(`${routeTitle} | ${this.settings.appName}`);
  }
}
