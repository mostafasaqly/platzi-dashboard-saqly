import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { APP_ROUTES } from '../../../core/constants/app-routes.const';
import { CurrentUser } from '../../../core/models/current-user.model';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthSessionService } from '../../../core/services/auth-session.service';
import {
  errorState,
  idleState,
  loadingState,
  successState,
} from '../../../shared/state/request-state.factory';
import { RequestState } from '../../../shared/models/request-state.model';
import { ApiError } from '../../../core/api/api-error.model';
import { AuthApiService } from '../data/auth-api.service';
import { LoginRequest } from '../models/login-request.model';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly authApi = inject(AuthApiService);
  private readonly authSession = inject(AuthSessionService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  private readonly _user = signal<CurrentUser | null>(null);
  private readonly _loginState = signal<RequestState>(idleState());
  private readonly _restoreState = signal<RequestState>(idleState());
  private readonly _initialized = signal(false);

  readonly user = this._user.asReadonly();
  readonly loginState = this._loginState.asReadonly();
  readonly restoreState = this._restoreState.asReadonly();
  readonly initialized = this._initialized.asReadonly();

  readonly isAuthenticated = computed(
    () => this.authSession.hasAccessToken() && !!this._user()
  );

  readonly isBusy = computed(
    () =>
      this._loginState().status === 'loading' ||
      this._restoreState().status === 'loading'
  );

  readonly displayName = computed(() => this._user()?.name?.trim() || 'Admin');

  readonly userInitial = computed(() => {
    const value = this.displayName();
    return value.charAt(0).toUpperCase();
  });

  readonly avatarUrl = computed(() => this._user()?.avatar || '');

  initialize(): void {
    if (this._initialized()) {
      return;
    }

    this._initialized.set(true);
    void this.restoreSession();
  }

  async login(payload: LoginRequest): Promise<void> {
    this._loginState.set(loadingState());

    try {
      const tokens = await firstValueFrom(this.authApi.login(payload));

      this.authSession.setSession(tokens.access_token, tokens.refresh_token);

      const profile = await firstValueFrom(this.authApi.getProfile());

      this._user.set(profile);
      this._loginState.set(successState());

      this.notification.success('Signed in successfully.');
      await this.router.navigateByUrl(`/${APP_ROUTES.dashboard}`);
    } catch (error) {
      const apiError = error as ApiError;
      this.authSession.clear();
      this._user.set(null);
      this._loginState.set(errorState(apiError.message || 'Unable to sign in.'));
    }
  }

  async restoreSession(): Promise<void> {
    if (!this.authSession.hasAccessToken() && !this.authSession.hasRefreshToken()) {
      this._restoreState.set(successState());
      return;
    }

    this._restoreState.set(loadingState());

    try {
      if (this.authSession.hasAccessToken()) {
        const profile = await firstValueFrom(this.authApi.getProfile());
        this._user.set(profile);
        this._restoreState.set(successState());
        return;
      }

      await this.refreshSession();
    } catch {
      try {
        await this.refreshSession();
      } catch {
        this.authSession.clear();
        this._user.set(null);
        this._restoreState.set(errorState('Session restore failed.'));
      }
    }
  }

  async logout(redirect = true): Promise<void> {
    this.authSession.clear();
    this._user.set(null);
    this._loginState.set(idleState());
    this._restoreState.set(successState());

    if (redirect) {
      await this.router.navigateByUrl(`/${APP_ROUTES.auth}/login`);
    }
  }

  private async refreshSession(): Promise<void> {
    const refreshToken = this.authSession.refreshToken();

    if (!refreshToken) {
      throw new Error('Missing refresh token.');
    }

    const tokens = await firstValueFrom(this.authApi.refreshToken(refreshToken));
    this.authSession.setSession(tokens.access_token, tokens.refresh_token);

    const profile = await firstValueFrom(this.authApi.getProfile());
    this._user.set(profile);
    this._restoreState.set(successState());
  }
}
