import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';

export default [
  {
    path: 'login',
    component: LoginPage,
    title:'Login'
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
] satisfies Routes;
