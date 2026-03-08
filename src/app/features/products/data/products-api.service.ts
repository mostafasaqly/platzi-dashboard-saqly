import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApiService } from '../../../core/api/base-api.service';
import { ProductCategory } from '../models/product-category.model';
import { CreateProductDto } from '../models/create-product.dto';
import { Product } from '../models/product.model';
import { ProductQuery } from '../models/product-query.model';
import { UpdateProductDto } from '../models/update-product.dto';

@Injectable({ providedIn: 'root' })
export class ProductsApiService extends BaseApiService {
  getProducts(query: ProductQuery): Observable<Product[]> {
    let params = new HttpParams()
      .set('offset', query.offset)
      .set('limit', query.limit);

    if (query.title?.trim()) {
      params = params.set('title', query.title.trim());
    }

    if (query.categoryId) {
      params = params.set('categoryId', query.categoryId);
    }

    return this.http.get<Product[]>(this.url('products'), { params });
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(this.url(`products/${id}`));
  }

  createProduct(payload: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(this.url('products'), payload);
  }

  updateProduct(id: number, payload: UpdateProductDto): Observable<Product> {
    return this.http.put<Product>(this.url(`products/${id}`), payload);
  }

  deleteProduct(id: number): Observable<boolean> {
    return this.http.delete<boolean>(this.url(`products/${id}`));
  }

  getCategories(): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(this.url('categories'));
  }
}
