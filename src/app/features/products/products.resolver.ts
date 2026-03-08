import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';

import { ProductsFacade } from './facades/products.facade';

export const productsResolver: ResolveFn<boolean> = async () => {
  const productsFacade = inject(ProductsFacade);
  await productsFacade.initialize();
  return true;
};
