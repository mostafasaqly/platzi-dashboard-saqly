import { Routes } from '@angular/router';
import { dashboardResolver } from './dashboard.resolver';
import { DashboardPage } from './pages/dashboard-page/dashboard-page';

export default [
  {
    path: '',
    component: DashboardPage,
    title: 'Dashboard',
    resolve: {
      dashboard: dashboardResolver,
    },
  },
] satisfies Routes;
