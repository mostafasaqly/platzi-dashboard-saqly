import { Injectable, computed, signal } from '@angular/core';

const ACCESS_TOKEN_KEY = 'platzi_admin_access_token';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  private readonly _token = signal<string | null>(localStorage.getItem(ACCESS_TOKEN_KEY));

  readonly token = computed(() => this._token());
  readonly isAuthenticated = computed(() => !!this._token());

  setToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    this._token.set(token);
  }

  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    this._token.set(null);
  }
}
