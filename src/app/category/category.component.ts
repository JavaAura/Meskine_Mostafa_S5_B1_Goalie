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

  deleteCategory(categoryId: number): void {
    this.categoryService.deleteCategory(categoryId).subscribe({
      next: (categories) => {
        (this.categories = categories);
        this.loadCategories();
      },
      error: (err) => (this.errorMessage = 'Failed to delete category' + err)
    });
  }
}
