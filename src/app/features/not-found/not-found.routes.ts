import { Routes } from '@angular/router';
import { NotFoundPage } from './pages/not-found-page/not-found-page';

export default [
  {
    path: '',
    component: NotFoundPage,
    title: 'Not Found',
  },
] satisfies Routes;
