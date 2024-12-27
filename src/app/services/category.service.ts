import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categories: Category[] = [];
  private nextId = 1;
  private localStorageKey = 'categories';

  constructor() {
    this.loadCategoriesFromStorage();
  }

  /**
   * Load categories from local storage when the service initializes.
   */
  private loadCategoriesFromStorage(): void {
    const storedCategories = localStorage.getItem(this.localStorageKey);
    this.categories = storedCategories ? JSON.parse(storedCategories) : [];
    this.nextId = this.categories.length > 0 ? Math.max(...this.categories.map(cat => cat.id)) + 1 : 1;
  }

  /**
   * Save categories to local storage.
   */
  private saveCategoriesToStorage(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.categories));
  }

  /**
   * Get all categories.
   */
  getCategories(): Observable<Category[]> {
    return of(this.categories);
  }

  /**
   * Create a new category.
   */
  createCategory(category: Category): Observable<Category> {
    if (this.categories.some((cat) => cat.name === category.name.trim())) {
      throw new Error('Category name must be unique');
    }

    category.id = this.nextId++;
    this.categories.push(category);
    this.saveCategoriesToStorage();
    return of(category);
  }

  /**
   * Delete a category by its ID.
   */
  deleteCategory(categoryId: number): Observable<Category[]> {
    this.categories = this.categories.filter((cat) => cat.id !== categoryId);
    this.saveCategoriesToStorage();
    return of(this.categories);
  }
}
