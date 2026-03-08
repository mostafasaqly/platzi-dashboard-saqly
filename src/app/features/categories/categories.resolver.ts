import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';

import { CategoriesFacade } from './facades/categories.facade';

export const categoriesResolver: ResolveFn<boolean> = async () => {
  const categoriesFacade = inject(CategoriesFacade);
  await categoriesFacade.loadCategories();
  return true;
};
