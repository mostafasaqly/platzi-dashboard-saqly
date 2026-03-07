import { Routes } from '@angular/router';
import { APP_ROUTES } from './core/constants/app-routes.const';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { AppShell } from './core/layout/app-shell/app-shell';

export const appRoutes: Routes = [
  {
    path: APP_ROUTES.auth,
    canMatch: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes'),
  },
  {
    path: '',
    component: AppShell,
    canMatch: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: APP_ROUTES.dashboard,
      },
      {
        path: APP_ROUTES.dashboard,
        loadChildren: () => import('./features/dashboard/dashboard.routes'),
      },
      {
        path: APP_ROUTES.products,
        loadChildren: () => import('./features/products/products.routes'),
      },
      {
        path: APP_ROUTES.categories,
        loadChildren: () => import('./features/categories/categories.routes'),
      },
      {
        path: APP_ROUTES.users,
        loadChildren: () => import('./features/users/users.routes'),
      },
      {
        path: APP_ROUTES.files,
        loadChildren: () => import('./features/file-upload/file-upload.routes'),
      },
      {
        path: APP_ROUTES.settings,
        loadChildren: () => import('./features/settings/settings.routes'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: APP_ROUTES.dashboard,
  },
];
