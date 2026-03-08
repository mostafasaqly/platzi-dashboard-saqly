import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PaginatorState } from 'primeng/paginator';

import { ConfirmService } from '../../../../core/services/confirm.service';
import { UI_PRIMENG } from '../../../../shared/ui/ui-primeng';
import { User } from '../../models/user.model';
import { UsersFacade } from '../../facades/users.facade';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { SectionCard } from '../../../../shared/components/section-card/section-card';
import { StateCard } from '../../../../shared/components/state-card/state-card';
import {
  IMAGE_FALLBACKS,
  resolveAvatarLabel,
  resolveImageUrl,
} from '../../../../shared/utils/media.util';

@Component({
  selector: 'app-users-list-page',
  imports: [
    PageHeader,
    SectionCard,
    StateCard,
    ...UI_PRIMENG,
  ],
  templateUrl: './users-list-page.html',
  styleUrl: './users-list-page.scss',
})
export class UsersListPage {
  protected readonly usersFacade = inject(UsersFacade);
  protected readonly searchValue = signal('');

  protected readonly first = signal(0);
  protected readonly rows = signal(6);
  protected readonly imageFallbacks = IMAGE_FALLBACKS;

  protected readonly totalRecords = computed(
    () => this.usersFacade.filteredUsers().length
  );

  protected readonly paginatedUsers = computed(() => {
    const users = this.usersFacade.filteredUsers();
    const start = this.first();
    const end = start + this.rows();
    return users.slice(start, end);
  });

  private readonly router = inject(Router);
  private readonly confirmService = inject(ConfirmService);

  protected onSearchChange(value: string): void {
    this.searchValue.set(value);
    this.first.set(0);
    this.usersFacade.setSearchTerm(value);
  }

  protected onPageChange(event: PaginatorState): void {
    this.first.set(event.first ?? 0);
    this.rows.set(event.rows ?? 6);
  }

  protected userAvatar(avatar: string | null | undefined): string | undefined {
    const resolved = resolveImageUrl(avatar, '');
    return resolved || undefined;
  }

  protected userInitial(name: string | null | undefined): string {
    return resolveAvatarLabel(name);
  }

  protected async goToCreate(): Promise<void> {
    await this.router.navigateByUrl('/users/new');
  }

  protected async goToEdit(user: User): Promise<void> {
    await this.router.navigateByUrl(`/users/${user.id}/edit`);
  }

  protected requestDelete(event: Event, user: User): void {
    this.confirmService.confirmDelete({
      target: event.currentTarget,
      entityName: user.name,
      onAccept: async () => {
        await this.usersFacade.deleteUser(user.id);
      },
    });
  }

  protected trackByUserId(_: number, user: User): number {
    return user.id;
  }
}
