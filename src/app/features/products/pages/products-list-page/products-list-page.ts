import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { UI_PRIMENG } from '../../../../shared/ui/ui-primeng';
import { ProductsFacade } from '../../facades/products.facade';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products-list-page',
  imports: [...UI_PRIMENG],
  templateUrl: './products-list-page.html',
  styleUrl: './products-list-page.scss',
})
export class ProductsListPage {
  protected readonly productsFacade = inject(ProductsFacade);
  protected readonly searchValue = signal('');

  private readonly router = inject(Router);

  constructor() {
    void this.productsFacade.initialize();
  }

  protected async onSearch(): Promise<void> {
    this.productsFacade.setSearchTerm(this.searchValue());
    await this.productsFacade.loadProducts();
  }

  protected async onCategoryChange(value: string | number | null): Promise<void> {
    const parsed = value ? Number(value) : null;
    this.productsFacade.setCategoryId(parsed);
    await this.productsFacade.loadProducts();
  }

  protected async onReset(): Promise<void> {
    this.searchValue.set('');
    this.productsFacade.resetFilters();
    await this.productsFacade.loadProducts();
  }

  protected async nextPage(): Promise<void> {
    this.productsFacade.nextPage();
    await this.productsFacade.loadProducts();
  }

  protected async previousPage(): Promise<void> {
    this.productsFacade.previousPage();
    await this.productsFacade.loadProducts();
  }

  protected async goToCreate(): Promise<void> {
    await this.router.navigateByUrl('/products/new');
  }

  protected async goToEdit(product: Product): Promise<void> {
    await this.router.navigateByUrl(`/products/${product.id}/edit`);
  }

  protected async deleteProduct(product: Product): Promise<void> {
    const confirmed = window.confirm(`Delete "${product.title}"?`);

    if (!confirmed) {
      return;
    }

    await this.productsFacade.deleteProduct(product.id);
  }

  protected trackByProductId(_: number, product: Product): number {
    return product.id;
  }
}
