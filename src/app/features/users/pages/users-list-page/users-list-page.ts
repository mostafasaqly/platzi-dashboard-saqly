import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { UI_PRIMENG } from '../../../../shared/ui/ui-primeng';
import { User } from '../../models/user.model';
import { UsersFacade } from '../../facades/users.facade';

@Component({
  selector: 'app-users-list-page',
  imports: [...UI_PRIMENG],
  templateUrl: './users-list-page.html',
  styleUrl: './users-list-page.scss',
})
export class UsersListPage {
  protected readonly usersFacade = inject(UsersFacade);
  protected readonly searchValue = signal('');

  private readonly router = inject(Router);

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

  protected async deleteUser(user: User): Promise<void> {
    const confirmed = window.confirm(`Delete "${user.name}"?`);

    if (!confirmed) {
      return;
    }

    await this.usersFacade.deleteUser(user.id);
  }

  protected trackByUserId(_: number, user: User): number {
    return user.id;
  }
}
