import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { BaseApiService } from '../../../core/api/base-api.service';
import { DashboardCategory } from '../models/dashboard-category.model';
import { DashboardProduct } from '../models/dashboard-product.model';
import { DashboardUser } from '../models/dashboard-user.model';

@Injectable({ providedIn: 'root' })
export class DashboardApiService extends BaseApiService {
  getProducts(): Observable<DashboardProduct[]> {
    return this.http.get<DashboardProduct[]>(this.url('products'));
  }

  getCategories(): Observable<DashboardCategory[]> {
    return this.http.get<DashboardCategory[]>(this.url('categories'));
  }

  getUsers(): Observable<DashboardUser[]> {
    return this.http.get<DashboardUser[]>(this.url('users'));
  }

  getDashboardData(): Observable<{
    products: DashboardProduct[];
    categories: DashboardCategory[];
    users: DashboardUser[];
  }> {
    return forkJoin({
      products: this.getProducts(),
      categories: this.getCategories(),
      users: this.getUsers(),
    });
  }
}
