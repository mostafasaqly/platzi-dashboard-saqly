import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../../core/api/base-api.service';
import { CurrentUser } from '../../../core/models/current-user.model';
import { AuthTokens } from '../models/auth-tokens.model';
import { LoginRequest } from '../models/login-request.model';

@Injectable({ providedIn: 'root' })
export class AuthApiService extends BaseApiService {
  login(payload: LoginRequest): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(this.url('auth/login'), payload);
  }

  getProfile(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(this.url('auth/profile'));
  }

  refreshToken(refreshToken: string): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(this.url('auth/refresh-token'), {
      refreshToken,
    });
  }
}
