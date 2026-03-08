import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ApiError } from '../../../core/api/api-error.model';
import { AppPreferencesService } from '../../../core/services/app-preferences.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RequestState } from '../../../shared/models/request-state.model';
import {
  errorState,
  idleState,
  loadingState,
  successState,
} from '../../../shared/state/request-state.factory';
import { ProductsApiService } from '../data/products-api.service';
import { CreateProductDto } from '../models/create-product.dto';
import { ProductCategory } from '../models/product-category.model';
import { Product } from '../models/product.model';
import { ProductQuery } from '../models/product-query.model';
import { UpdateProductDto } from '../models/update-product.dto';

@Injectable({ providedIn: 'root' })
export class ProductsFacade {
  private readonly productsApi = inject(ProductsApiService);
  private readonly notification = inject(NotificationService);
  private readonly preferencesService = inject(AppPreferencesService);

  private readonly _products = signal<Product[]>([]);
  private readonly _categories = signal<ProductCategory[]>([]);
  private readonly _listState = signal<RequestState>(idleState());
  private readonly _categoriesState = signal<RequestState>(idleState());
  private readonly _submitState = signal<RequestState>(idleState());

  private readonly _searchTerm = signal('');
  private readonly _selectedCategoryId = signal<number | null>(null);
  private readonly _page = signal(1);
  private readonly _pageSize = signal(this.preferencesService.productsPageSize());

  readonly products = this._products.asReadonly();
  readonly categories = this._categories.asReadonly();
  readonly listState = this._listState.asReadonly();
  readonly categoriesState = this._categoriesState.asReadonly();
  readonly submitState = this._submitState.asReadonly();

  readonly searchTerm = this._searchTerm.asReadonly();
  readonly selectedCategoryId = this._selectedCategoryId.asReadonly();
  readonly page = this._page.asReadonly();
  readonly pageSize = this._pageSize.asReadonly();

  readonly isLoading = computed(() => this._listState().status === 'loading');
  readonly isSubmitting = computed(() => this._submitState().status === 'loading');
  readonly hasError = computed(() => this._listState().status === 'error');
  readonly hasItems = computed(() => this._products().length > 0);
  readonly isEmpty = computed(
    () => !this.isLoading() && !this.hasError() && this._products().length === 0
  );

  readonly offset = computed(() => (this._page() - 1) * this._pageSize());

  readonly query = computed<ProductQuery>(() => ({
    title: this._searchTerm().trim() || undefined,
    categoryId: this._selectedCategoryId(),
    offset: this.offset(),
    limit: this._pageSize(),
  }));

  async loadCategories(): Promise<void> {
    if (this._categories().length > 0) {
      return;
    }

    this._categoriesState.set(loadingState());

    try {
      const categories = await firstValueFrom(this.productsApi.getCategories());
      this._categories.set(categories);
      this._categoriesState.set(successState());
    } catch (error) {
      const apiError = error as ApiError;
      this._categoriesState.set(
        errorState(apiError.message || 'Failed to load categories.')
      );
    }
  }

  async loadProducts(): Promise<void> {
    this._pageSize.set(this.preferencesService.productsPageSize());
    this._listState.set(loadingState());

    try {
      const products = await firstValueFrom(
        this.productsApi.getProducts(this.query())
      );

      this._products.set(products);
      this._listState.set(successState());
    } catch (error) {
      const apiError = error as ApiError;
      this._products.set([]);
      this._listState.set(errorState(apiError.message || 'Failed to load products.'));
    }
  }

  async initialize(): Promise<void> {
    await Promise.all([this.loadCategories(), this.loadProducts()]);
  }

  async refresh(): Promise<void> {
    await this.loadProducts();
  }

  async createProduct(payload: CreateProductDto): Promise<Product | null> {
    this._submitState.set(loadingState());

    try {
      const product = await firstValueFrom(this.productsApi.createProduct(payload));
      this._submitState.set(successState());
      this.notification.success('Product created successfully.');
      return product;
    } catch (error) {
      const apiError = error as ApiError;
      this._submitState.set(
        errorState(apiError.message || 'Failed to create product.')
      );
      return null;
    }
  }

  async updateProduct(
    id: number,
    payload: UpdateProductDto
  ): Promise<Product | null> {
    this._submitState.set(loadingState());

    try {
      const product = await firstValueFrom(
        this.productsApi.updateProduct(id, payload)
      );
      this._submitState.set(successState());
      this.notification.success('Product updated successfully.');
      return product;
    } catch (error) {
      const apiError = error as ApiError;
      this._submitState.set(
        errorState(apiError.message || 'Failed to update product.')
      );
      return null;
    }
  }

  async deleteProduct(id: number): Promise<void> {
    this._submitState.set(loadingState());

    try {
      await firstValueFrom(this.productsApi.deleteProduct(id));
      this._submitState.set(successState());
      this.notification.success('Product deleted successfully.');
      await this.loadProducts();
    } catch (error) {
      const apiError = error as ApiError;
      this._submitState.set(
        errorState(apiError.message || 'Failed to delete product.')
      );
    }
  }

  async getProductById(id: number): Promise<Product | null> {
    try {
      return await firstValueFrom(this.productsApi.getProductById(id));
    } catch {
      return null;
    }
  }

  setSearchTerm(value: string): void {
    this._searchTerm.set(value);
    this._page.set(1);
  }

  setCategoryId(value: number | null): void {
    this._selectedCategoryId.set(value);
    this._page.set(1);
  }

  nextPage(): void {
    this._page.update((value) => value + 1);
  }

  previousPage(): void {
    this._page.update((value) => Math.max(1, value - 1));
  }

  resetFilters(): void {
    this._searchTerm.set('');
    this._selectedCategoryId.set(null);
    this._page.set(1);
  }

  imagePreview(images: string[] | null | undefined): string {
    return (
      images?.find((image) => !!image?.trim()) ||
      'https://placehold.co/200x200?text=No+Image'
    );
  }

  categoryName(categoryId: number): string {
    return this._categories().find((item) => item.id === categoryId)?.name || '';
  }
}
