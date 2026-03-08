import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';

import { DashboardFacade } from './facades/dashboard.facade';

export const dashboardResolver: ResolveFn<boolean> = async () => {
  const dashboardFacade = inject(DashboardFacade);
  await dashboardFacade.load();
  return true;
};
