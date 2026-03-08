import { Routes } from '@angular/router';
import { usersResolver } from './users.resolver';
import { UsersListPage } from './pages/users-list-page/users-list-page';
import { UserFormPage } from './pages/user-form-page/user-form-page';

export default [
  {
    path: '',
    component: UsersListPage,
    title: 'Users',
    resolve: {
      users: usersResolver,
    },
  },
  {
    path: 'new',
    component: UserFormPage,
    title: 'New User',
  },
  {
    path: ':id/edit',
    component: UserFormPage,
    title: 'Edit User',
  },
] satisfies Routes;
