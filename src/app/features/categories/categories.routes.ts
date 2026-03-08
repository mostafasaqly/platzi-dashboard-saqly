import { Routes } from '@angular/router';
import { categoriesResolver } from './categories.resolver';
import { CategoriesListPage } from './pages/categories-list-page/categories-list-page';
import { CategoryFormPage } from './pages/category-form-page/category-form-page';

export default [
  {
    path: '',
    component: CategoriesListPage,
    title: 'Categories',
    resolve: {
      categories: categoriesResolver,
    },
  },
  {
    path: 'new',
    component: CategoryFormPage,
    title: 'New Category',
  },
  {
    path: ':id/edit',
    component: CategoryFormPage,
    title: 'Edit Category',
  },
] satisfies Routes;
