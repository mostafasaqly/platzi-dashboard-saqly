import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { ConfirmService } from '../../../../core/services/confirm.service';
import { UI_PRIMENG } from '../../../../shared/ui/ui-primeng';
import { User } from '../../models/user.model';
import { UsersFacade } from '../../facades/users.facade';
import { SectionCard } from '../../../../shared/components/section-card/section-card';
import { StateCard } from '../../../../shared/components/state-card/state-card';
import { PageHeader } from '../../../../shared/components/page-header/page-header';

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

  private readonly router = inject(Router);
  private readonly confirmService = inject(ConfirmService);

  constructor() {
    void this.usersFacade.loadUsers();
  }

  protected onSearchChange(value: string): void {
    this.searchValue.set(value);
    this.usersFacade.setSearchTerm(value);
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
