import { Injectable, computed, signal } from '@angular/core';

const ACCESS_TOKEN_KEY = 'platzi_admin_access_token';
const REFRESH_TOKEN_KEY = 'platzi_admin_refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly _accessToken = signal<string | null>(
    localStorage.getItem(ACCESS_TOKEN_KEY)
  );

  private readonly _refreshToken = signal<string | null>(
    localStorage.getItem(REFRESH_TOKEN_KEY)
  );

  readonly accessToken = computed(() => this._accessToken());
  readonly refreshToken = computed(() => this._refreshToken());

  readonly hasAccessToken = computed(() => !!this._accessToken());
  readonly hasRefreshToken = computed(() => !!this._refreshToken());

  setSession(accessToken: string, refreshToken: string | null): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    this._accessToken.set(accessToken);

    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      this._refreshToken.set(refreshToken);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      this._refreshToken.set(null);
    }
  }

  updateAccessToken(accessToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    this._accessToken.set(accessToken);
  }

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    this._accessToken.set(null);
    this._refreshToken.set(null);
  }
}
