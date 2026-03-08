import { Routes } from '@angular/router';
import { CategoryFormPage } from './pages/category-form-page/category-form-page';
import { CategoriesListPage } from './pages/categories-list-page/categories-list-page';

export default [
  {
      path: '',
      component: CategoriesListPage,
    },
    {
      path: 'new',
      component: CategoryFormPage,
    },
    {
      path: ':id/edit',
      component: CategoryFormPage,
    },
] satisfies Routes;
