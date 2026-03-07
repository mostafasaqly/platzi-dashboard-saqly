import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlTree } from '@angular/router';
import { APP_ROUTES } from '../constants/app-routes.const';
import { AuthSessionService } from '../services/auth-session.service';

export const guestGuard: CanMatchFn = (): boolean | UrlTree => {
  const authSession = inject(AuthSessionService);
  const router = inject(Router);

  return authSession.hasAccessToken()
    ? router.createUrlTree(['/', APP_ROUTES.dashboard])
    : true;
};
