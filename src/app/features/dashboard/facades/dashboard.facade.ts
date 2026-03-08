import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ApiError } from '../../../core/api/api-error.model';
import {
  errorState,
  idleState,
  loadingState,
  successState,
} from '../../../shared/state/request-state.factory';
import { RequestState } from '../../../shared/models/request-state.model';
import { DashboardApiService } from '../data/dashboard-api.service';
import { DashboardCategory } from '../models/dashboard-category.model';
import { DashboardProduct } from '../models/dashboard-product.model';
import { DashboardStats } from '../models/dashboard-stats.model';
import { DashboardUser } from '../models/dashboard-user.model';

interface DashboardStatCard {
  label: string;
  value: number;
  icon: string;
  tone: 'primary' | 'success' | 'warning' | 'info';
}

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private readonly dashboardApi = inject(DashboardApiService);

  private readonly _state = signal<RequestState>(idleState());
  private readonly _stats = signal<DashboardStats>({
    totalProducts: 0,
    totalCategories: 0,
    totalUsers: 0,
    productsWithImages: 0,
  });
  private readonly _recentProducts = signal<DashboardProduct[]>([]);
  private readonly _recentUsers = signal<DashboardUser[]>([]);
  private readonly _categories = signal<DashboardCategory[]>([]);

  readonly state = this._state.asReadonly();
  readonly stats = this._stats.asReadonly();
  readonly recentProducts = this._recentProducts.asReadonly();
  readonly recentUsers = this._recentUsers.asReadonly();
  readonly categories = this._categories.asReadonly();

  readonly isLoading = computed(() => this._state().status === 'loading');
  readonly hasError = computed(() => this._state().status === 'error');
  readonly isEmpty = computed(
    () =>
      !this.isLoading() &&
      !this.hasError() &&
      this._stats().totalProducts === 0 &&
      this._stats().totalUsers === 0 &&
      this._stats().totalCategories === 0,
  );
  private readonly _isRefreshing = signal(false);

  readonly isRefreshing = this._isRefreshing.asReadonly();
  readonly hasData = computed(
    () =>
      this._stats().totalProducts > 0 ||
      this._stats().totalUsers > 0 ||
      this._stats().totalCategories > 0,
  );

  readonly statCards = computed<DashboardStatCard[]>(() => {
    const stats = this._stats();
    return [
      {
        label: 'Products',
        value: stats.totalProducts,
        icon: 'pi pi-box',
        tone: 'primary',
      },
      {
        label: 'Categories',
        value: stats.totalCategories,
        icon: 'pi pi-tags',
        tone: 'success',
      },
      {
        label: 'Users',
        value: stats.totalUsers,
        icon: 'pi pi-users',
        tone: 'warning',
      },
      {
        label: 'With Images',
        value: stats.productsWithImages,
        icon: 'pi pi-images',
        tone: 'info',
      },
    ];
  });

  readonly categoryChartData = computed(() => {
    const categories = this._categories();

    const truncate = (value: string, max = 18) =>
      value.length > max ? `${value.slice(0, max)}…` : value;

    return {
      labels: categories.map((category) => truncate(category.name)),
      datasets: [
        {
          data: categories.map((_, index) => index + 1),
          backgroundColor: [
            '#38bdf8',
            '#fb7185',
            '#fb923c',
            '#fbbf24',
            '#2dd4bf',
            '#a78bfa',
            '#cbd5e1',
            '#60a5fa',
          ],
          borderColor: '#0b1220',
          borderWidth: 2,
          hoverBorderWidth: 2,
          hoverOffset: 6,
        },
      ],
    };
  });

  readonly categoryChartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '55%',
    plugins: {
      legend: {
        position: 'bottom',
        align: 'center',
        maxWidth: 320,
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 10,
          boxHeight: 10,
          padding: 20,
          color: '#94a3b8',
          font: {
            size: 12,
            weight: '500',
          },
        },
      },
    },
  }));

  async load(forceRefresh = false): Promise<void> {
    const hasExistingData = this.hasData();

    if (forceRefresh && hasExistingData) {
      this._isRefreshing.set(true);
    } else {
      this._state.set(loadingState());
    }

    try {
      const { products, categories, users } = await firstValueFrom(
        this.dashboardApi.getDashboardData(),
      );

      const sortedProducts = [...products].sort((a, b) => b.creationAt.localeCompare(a.creationAt));

      const sortedUsers = [...users].sort((a, b) => b.creationAt.localeCompare(a.creationAt));

      this._stats.set({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalUsers: users.length,
        productsWithImages: products.filter(
          (product) => Array.isArray(product.images) && product.images.length > 0,
        ).length,
      });

      this._recentProducts.set(sortedProducts.slice(0, 6));
      this._recentUsers.set(sortedUsers.slice(0, 6));
      this._categories.set(categories.slice(0, 8));
      this._state.set(successState());
    } catch (error) {
      const apiError = error as ApiError;
      this._state.set(errorState(apiError.message || 'Failed to load dashboard.'));
    } finally {
      this._isRefreshing.set(false);
    }
  }
}
