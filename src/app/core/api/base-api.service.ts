import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { APP_SETTINGS } from '../config/app.settings';

export abstract class BaseApiService {

  protected readonly http = inject(HttpClient);
  protected readonly settings = inject(APP_SETTINGS);

  protected url(path: string): string {
    return `${this.settings.apiBaseUrl}/${path}`;
  }

}
