import { Routes } from '@angular/router';
import { productsResolver } from './products.resolver';
import { ProductsListPage } from './pages/products-list-page/products-list-page';
import { ProductFormPage } from './pages/product-form-page/product-form-page';

export default [
  {
    path: '',
    component: ProductsListPage,
    title: 'Products',
    resolve: {
      products: productsResolver,
    },
  },
  {
    path: 'new',
    component: ProductFormPage,
    title: 'New Product',
  },
  {
    path: ':id/edit',
    component: ProductFormPage,
    title: 'Edit Product',
  },
] satisfies Routes;
