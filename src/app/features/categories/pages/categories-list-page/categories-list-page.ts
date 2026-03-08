import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

import { UI_PRIMENG } from '../../../../shared/ui/ui-primeng';
import { CategoriesFacade } from '../../facades/categories.facade';
import { Category } from '../../models/category.model';
import { PaginatorState } from 'primeng/paginator';

interface CategoriesPageChangeEvent {
  first: number;
  rows: number;
}

@Component({
  selector: 'app-categories-page',
  imports: [...UI_PRIMENG],
  templateUrl: './categories-list-page.html',
  styleUrl: './categories-list-page.scss',
})
export class CategoriesListPage {
  protected readonly categoriesFacade = inject(CategoriesFacade);

  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  constructor() {
    void this.categoriesFacade.loadCategories();
  }

  protected onSearch(value: string): void {
    this.categoriesFacade.setSearchTerm(value);
  }

  protected onPageChange(event: PaginatorState): void {
  this.categoriesFacade.setPage(event.first ?? 0, event.rows ?? 6);
}

  protected createCategory(): void {
    void this.router.navigateByUrl('/categories/new');
  }

  protected editCategory(category: Category): void {
    void this.router.navigateByUrl(`/categories/${category.id}/edit`);
  }

  protected confirmDelete(category: Category): void {
    this.confirmationService.confirm({
      header: 'Delete Category',
      message: `Are you sure you want to delete "${category.name}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        void this.categoriesFacade.deleteCategory(category.id);
      },
    });
  }

  protected onImageError(event: Event): void {
    const element = event.target as HTMLImageElement | null;
    if (!element) return;

    const fallback = '/category-placeholder.png';
    if (element.src !== fallback) {
      element.src = fallback;
      element.onerror = null;
    }
  }

}
