import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ApiError } from '../../../core/api/api-error.model';
import { NotificationService } from '../../../core/services/notification.service';
import { RequestState } from '../../../shared/models/request-state.model';
import {
  errorState,
  idleState,
  loadingState,
  successState,
} from '../../../shared/state/request-state.factory';
import { CategoriesApiService } from '../data/categories-api.service';
import { Category } from '../models/category.model';
import { CreateCategoryDto } from '../models/create-category.dto';
import { UpdateCategoryDto } from '../models/update-category.dto';

@Injectable({ providedIn: 'root' })
export class CategoriesFacade {
  private readonly categoriesApi = inject(CategoriesApiService);
  private readonly notification = inject(NotificationService);

  private readonly _categories = signal<Category[]>([]);
  private readonly _listState = signal<RequestState>(idleState());
  private readonly _submitState = signal<RequestState>(idleState());
  private readonly _searchTerm = signal('');

  private readonly _first = signal(0);
  private readonly _rows = signal(6);

  readonly categories = this._categories.asReadonly();
  readonly listState = this._listState.asReadonly();
  readonly submitState = this._submitState.asReadonly();
  readonly searchTerm = this._searchTerm.asReadonly();
  readonly first = this._first.asReadonly();
  readonly rows = this._rows.asReadonly();

  readonly filteredCategories = computed(() => {
    const term = this._searchTerm().trim().toLowerCase();

    if (!term) {
      return this._categories();
    }

    return this._categories().filter((category) => category.name.toLowerCase().includes(term));
  });

  readonly totalRecords = computed(() => this.filteredCategories().length);

  readonly pagedCategories = computed(() => {
    const start = this._first();
    const end = start + this._rows();
    return this.filteredCategories().slice(start, end);
  });

  readonly isLoading = computed(() => this._listState().status === 'loading');
  readonly isSubmitting = computed(() => this._submitState().status === 'loading');
  readonly hasError = computed(() => this._listState().status === 'error');
  readonly isEmpty = computed(
    () => !this.isLoading() && !this.hasError() && this.filteredCategories().length === 0,
  );

  async loadCategories(): Promise<void> {
    this._listState.set(loadingState());

    try {
      const categories = await firstValueFrom(this.categoriesApi.getCategories());
      this._categories.set(categories);
      this._listState.set(successState());
      this.resetPagination();
    } catch (error) {
      const apiError = error as ApiError;
      this._categories.set([]);
      this._listState.set(errorState(apiError.message || 'Failed to load categories.'));
    }
  }

  async createCategory(payload: CreateCategoryDto): Promise<Category | null> {
    this._submitState.set(loadingState());

    try {
      const category = await firstValueFrom(this.categoriesApi.createCategory(payload));
      this._submitState.set(successState());
      this.notification.success('Category created successfully.');
      return category;
    } catch (error) {
      const apiError = error as ApiError;
      this._submitState.set(errorState(apiError.message || 'Failed to create category.'));
      return null;
    }
  }

  async updateCategory(id: number, payload: UpdateCategoryDto): Promise<Category | null> {
    this._submitState.set(loadingState());

    try {
      const category = await firstValueFrom(this.categoriesApi.updateCategory(id, payload));
      this._submitState.set(successState());
      this.notification.success('Category updated successfully.');
      return category;
    } catch (error) {
      const apiError = error as ApiError;
      this._submitState.set(errorState(apiError.message || 'Failed to update category.'));
      return null;
    }
  }

  async deleteCategory(id: number): Promise<void> {
    this._submitState.set(loadingState());

    try {
      await firstValueFrom(this.categoriesApi.deleteCategory(id));
      this._submitState.set(successState());
      this.notification.success('Category deleted successfully.');
      await this.loadCategories();
    } catch (error) {
      const apiError = error as ApiError;
      this._submitState.set(errorState(apiError.message || 'Failed to delete category.'));
    }
  }

  async getCategoryById(id: number): Promise<Category | null> {
    try {
      return await firstValueFrom(this.categoriesApi.getCategoryById(id));
    } catch {
      return null;
    }
  }

  setSearchTerm(value: string): void {
    this._searchTerm.set(value);
    this.resetPagination();
  }

  setPage(first: number, rows: number): void {
    this._first.set(first);
    this._rows.set(rows);
  }

  imagePreview(image: string | null | undefined): string {
    return this.isSafeImageUrl(image) ? image!.trim() : '/category-placeholder.png';
  }

  private isSafeImageUrl(url: string | null | undefined): boolean {
    if (!url?.trim()) return false;

    const value = url.trim().toLowerCase();

    if (value.includes('placeimg.com')) return false;
    if (value.includes('/api/v1/files/')) return false;
    if (value.includes('avataaars.com')) return false;

    const isHttp = value.startsWith('http://') || value.startsWith('https://');
    const isLocal = value.startsWith('/');

    return isHttp || isLocal;
  }

  normalizeCategoryName(name: string | null | undefined): string {
    return name?.trim() || 'Unnamed category';
  }

  private resetPagination(): void {
    this._first.set(0);
  }
}
