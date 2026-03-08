import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApiService } from '../../../core/api/base-api.service';
import { CreateUserDto } from '../models/create-user.dto';
import { UpdateUserDto } from '../models/update-user.dto';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersApiService extends BaseApiService {
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url('users'));
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(this.url(`users/${id}`));
  }

  createUser(payload: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.url('users'), payload);
  }

  updateUser(id: number, payload: UpdateUserDto): Observable<User> {
    return this.http.put<User>(this.url(`users/${id}`), payload);
  }

  deleteUser(id: number): Observable<boolean> {
    return this.http.delete<boolean>(this.url(`users/${id}`));
  }
}
