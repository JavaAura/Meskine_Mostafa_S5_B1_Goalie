import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '../models/category.model';
import {TaskService} from "./task.service";

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categories: Category[] = [];
  private nextId = 1;
  private localStorageKey = 'categories';

  constructor(private taskService: TaskService) {
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
    category.id = this.nextId++;
    this.categories.push(category);
    this.saveCategoriesToStorage();
    return of(category);
  }

  editCategory(updatedCategory: Category): Observable<Category> {
    const index = this.categories.findIndex(cat => cat.id === updatedCategory.id);
    if (index !== -1) {
      this.categories[index] = updatedCategory;
      this.saveCategoriesToStorage();
    }
    return of(updatedCategory);
  }

  /**
   * Delete a category by its ID.
   */
  deleteCategory(categoryId: number): Observable<Category[]> {
    this.categories = this.categories.filter((cat) => cat.id !== categoryId);
    this.saveCategoriesToStorage();
    this.taskService.deleteTasksByCategoryId(categoryId);
    return of(this.categories);
  }

  getCategoryTaskCount(categoryId: number): number {
    return this.taskService.getTasksByCategoryId(categoryId).length;
  }
}
