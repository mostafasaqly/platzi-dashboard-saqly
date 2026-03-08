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
import { CreateUserDto } from '../models/create-user.dto';
import { UpdateUserDto } from '../models/update-user.dto';
import { User } from '../models/user.model';
import { UsersApiService } from '../data/users-api.service';

@Injectable({ providedIn: 'root' })
export class UsersFacade {
  private readonly usersApi = inject(UsersApiService);
  private readonly notification = inject(NotificationService);

  private readonly _users = signal<User[]>([]);
  private readonly _listState = signal<RequestState>(idleState());
  private readonly _submitState = signal<RequestState>(idleState());
  private readonly _searchTerm = signal('');

  readonly users = this._users.asReadonly();
  readonly listState = this._listState.asReadonly();
  readonly submitState = this._submitState.asReadonly();
  readonly searchTerm = this._searchTerm.asReadonly();

  readonly filteredUsers = computed(() => {
    const term = this._searchTerm().trim().toLowerCase();

    if (!term) {
      return this._users();
    }

    return this._users().filter((user) => {
      return (
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
      );
    });
  });

  readonly isLoading = computed(() => this._listState().status === 'loading');
  readonly isSubmitting = computed(() => this._submitState().status === 'loading');
  readonly hasError = computed(() => this._listState().status === 'error');
  readonly isEmpty = computed(
    () => !this.isLoading() && !this.hasError() && this.filteredUsers().length === 0
  );

  async loadUsers(): Promise<void> {
    this._listState.set(loadingState());

    try {
      const users = await firstValueFrom(this.usersApi.getUsers());
      this._users.set(users);
      this._listState.set(successState());
    } catch (error) {
      const apiError = error as ApiError;
      this._users.set([]);
      this._listState.set(errorState(apiError.message || 'Failed to load users.'));
    }
  }

  async createUser(payload: CreateUserDto): Promise<User | null> {
    this._submitState.set(loadingState());

    try {
      const user = await firstValueFrom(this.usersApi.createUser(payload));
      this._submitState.set(successState());
      this.notification.success('User created successfully.');
      return user;
    } catch (error) {
      const apiError = error as ApiError;
      this._submitState.set(errorState(apiError.message || 'Failed to create user.'));
      return null;
    }
  }

  async updateUser(id: number, payload: UpdateUserDto): Promise<User | null> {
    this._submitState.set(loadingState());

    try {
      const user = await firstValueFrom(this.usersApi.updateUser(id, payload));
      this._submitState.set(successState());
      this.notification.success('User updated successfully.');
      return user;
    } catch (error) {
      const apiError = error as ApiError;
      this._submitState.set(errorState(apiError.message || 'Failed to update user.'));
      return null;
    }
  }

  async deleteUser(id: number): Promise<void> {
    this._submitState.set(loadingState());

    try {
      await firstValueFrom(this.usersApi.deleteUser(id));
      this._submitState.set(successState());
      this.notification.success('User deleted successfully.');
      await this.loadUsers();
    } catch (error) {
      const apiError = error as ApiError;
      this._submitState.set(errorState(apiError.message || 'Failed to delete user.'));
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      return await firstValueFrom(this.usersApi.getUserById(id));
    } catch {
      return null;
    }
  }

  setSearchTerm(value: string): void {
    this._searchTerm.set(value);
  }

  avatarPreview(avatar: string | null | undefined): string {
    return avatar?.trim() || 'https://placehold.co/200x200?text=User';
  }

  roleSeverity(role: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'danger';
      case 'customer':
        return 'success';
      default:
        return 'info';
    }
  }
}
