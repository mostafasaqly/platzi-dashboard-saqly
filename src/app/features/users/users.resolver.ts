import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';

import { UsersFacade } from './facades/users.facade';

export const usersResolver: ResolveFn<boolean> = async () => {
  const usersFacade = inject(UsersFacade);
  await usersFacade.loadUsers();
  return true;
};
