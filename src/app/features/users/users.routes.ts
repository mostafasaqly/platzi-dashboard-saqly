import { Routes } from '@angular/router';
import { UsersListPage } from './pages/users-list-page/users-list-page';
import { UserFormPage } from './pages/user-form-page/user-form-page';

export default [
  {
    path: '',
    component: UsersListPage,
  },
  {
      path: 'new',
      component: UserFormPage,
    },
    {
      path: ':id/edit',
      component: UserFormPage,
    },
] satisfies Routes;
