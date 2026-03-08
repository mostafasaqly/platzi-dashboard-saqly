import { Routes } from '@angular/router';
import { ProductFormPage } from './pages/product-form-page/product-form-page';
import { ProductsListPage } from './pages/products-list-page/products-list-page';

export default [
  {
    path: '',
    component: ProductsListPage,
  },
  {
    path: 'new',
    component: ProductFormPage,
  },
  {
    path: ':id/edit',
    component: ProductFormPage,
  },
] satisfies Routes;
