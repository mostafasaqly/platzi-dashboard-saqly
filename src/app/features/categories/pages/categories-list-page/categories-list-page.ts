import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PaginatorState } from 'primeng/paginator';

import { ConfirmService } from '../../../../core/services/confirm.service';
import { UI_PRIMENG } from '../../../../shared/ui/ui-primeng';
import { CategoriesFacade } from '../../facades/categories.facade';
import { Category } from '../../models/category.model';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { SectionCard } from '../../../../shared/components/section-card/section-card';
import { StateCard } from '../../../../shared/components/state-card/state-card';

@Component({
  selector: 'app-categories-list-page',
  imports: [
    PageHeader,
    SectionCard,
    StateCard,
    ...UI_PRIMENG,
  ],
  templateUrl: './categories-list-page.html',
  styleUrl: './categories-list-page.scss',
})
export class CategoriesListPage {
  protected readonly categoriesFacade = inject(CategoriesFacade);
  protected readonly searchValue = signal('');

  protected readonly first = signal(0);
  protected readonly rows = signal(6);

  protected readonly totalRecords = computed(
    () => this.categoriesFacade.filteredCategories().length
  );

  protected readonly paginatedCategories = computed(() => {
    const categories = this.categoriesFacade.filteredCategories();
    const start = this.first();
    const end = start + this.rows();
    return categories.slice(start, end);
  });

  private readonly router = inject(Router);
  private readonly confirmService = inject(ConfirmService);

  protected onSearchChange(value: string): void {
    this.searchValue.set(value);
    this.first.set(0);
    this.categoriesFacade.setSearchTerm(value);
  }

  protected onPageChange(event: PaginatorState): void {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 6);
  }

  protected async goToCreate(): Promise<void> {
    await this.router.navigateByUrl('/categories/new');
  }

  protected async goToEdit(category: Category): Promise<void> {
    await this.router.navigateByUrl(`/categories/${category.id}/edit`);
  }

  protected requestDelete(event: Event, category: Category): void {
    this.confirmService.confirmDelete({
      target: event.currentTarget,
      entityName: category.name,
      onAccept: async () => {
        await this.categoriesFacade.deleteCategory(category.id);
      },
    });
  }

  protected trackByCategoryId(_: number, category: Category): number {
    return category.id;
  }
}
