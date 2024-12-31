import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})

export class CategoryComponent implements OnInit {
  categories: Category[] = [];
  newCategoryName: string = '';
  errorMessage: string = '';
  popUpErrorMessage: string = '';
  selectedCategory: Category | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => (this.categories = categories),
      error: (err) => (this.errorMessage = 'unexpected error' + err)
    });
  }

  addCategory(): void {
    this.errorMessage = '';

    if (!this.newCategoryName.trim()) {
      this.errorMessage = 'Category name cannot be empty!';
      return;
    }

    if (this.categories.some((cat) => cat.name === this.newCategoryName.trim())) {
      this.errorMessage = `Category with the name '${this.newCategoryName}' already exists!`;
      return;
    }

    const newCategory: Category = { id: 1 ,name: this.newCategoryName.trim() };
    this.categoryService.createCategory(newCategory).subscribe({
      next: () => {
        this.loadCategories();
        this.newCategoryName = '';
      },
      error: (err) => (this.errorMessage = 'Failed to add category' + err)
    });
  }

  editCategory(): void {
    if (this.selectedCategory) {
      this.popUpErrorMessage = '';
      const catName = this.selectedCategory.name.trim();

      if (!this.selectedCategory.name.trim()) {
        this.popUpErrorMessage = 'Category name cannot be empty!';
        return;
      }

      if (this.selectedCategory && this.categories.some((cat) => cat.name === catName)) {
        this.popUpErrorMessage = `Category with the name '${this.selectedCategory.name}' already exists!`;
        return;
      }

      this.categoryService.editCategory(this.selectedCategory).subscribe({
        next: () => {
          this.loadCategories();
          this.selectedCategory = null;
        },
        error: (err) => (this.errorMessage = 'Failed to edit category: ' + err)
      });
    }
  }

  deleteCategory(categoryId: number): void {
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: (categories) => {
        (this.categories = categories);
        this.loadCategories();
      },
      error: (err) => (this.errorMessage = 'Failed to delete category' + err)
    });
  }

  selectCategory(category: Category): void {
    this.selectedCategory = { ...category };
  }

  getCategoryTaskCount(categoryId: number): number {
    return this.categoryService.getCategoryTaskCount(categoryId);
  }
}
