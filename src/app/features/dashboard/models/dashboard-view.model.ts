import { DashboardCategory } from './dashboard-category.model';
import { DashboardProduct } from './dashboard-product.model';
import { DashboardStats } from './dashboard-stats.model';
import { DashboardUser } from './dashboard-user.model';

export interface DashboardView {
  stats: DashboardStats;
  recentProducts: DashboardProduct[];
  recentUsers: DashboardUser[];
  categories: DashboardCategory[];
}
