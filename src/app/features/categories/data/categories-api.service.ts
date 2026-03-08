import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApiService } from '../../../core/api/base-api.service';
import { Category } from '../models/category.model';
import { CreateCategoryDto } from '../models/create-category.dto';
import { UpdateCategoryDto } from '../models/update-category.dto';

@Injectable({ providedIn: 'root' })
export class CategoriesApiService extends BaseApiService {
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url('categories'));
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(this.url(`categories/${id}`));
  }

  createCategory(payload: CreateCategoryDto): Observable<Category> {
    return this.http.post<Category>(this.url('categories'), payload);
  }

  updateCategory(id: number, payload: UpdateCategoryDto): Observable<Category> {
    return this.http.put<Category>(this.url(`categories/${id}`), payload);
  }

  deleteCategory(id: number): Observable<boolean> {
    return this.http.delete<boolean>(this.url(`categories/${id}`));
  }
}
