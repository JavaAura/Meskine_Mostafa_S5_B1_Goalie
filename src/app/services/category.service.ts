import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '../models/category/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories: Category[] = [];
  private nextId = 1;

  getCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  createCategory(category: Category): Observable<Category> {
    if (this.categories.some((cat) => cat.name === category.name.trim())) {
      throw new Error('Category name must be unique');
    }

    category.id = this.nextId++;
    this.categories.push(category);
    return of(category);
  }

  deleteCategory(categoryId: number): Observable<void> {
    this.categories = this.categories.filter((cat) => cat.id !== categoryId);
    return of();
  }
}
