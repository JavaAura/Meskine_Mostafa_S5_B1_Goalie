import { Component } from '@angular/core';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import {FormsModule} from "@angular/forms";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {CategoryService} from "../services/category.service";
import {Category} from "../models/category.model";

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    DatePipe,
    NgClass
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})

export class TaskComponent {
  tasks: Task[] = [];
  notStartedTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  completedTasks: Task[] = [];
  isTaskFormOpen = false;
  formTask: Task = this.getEmptyTask();
  selectedTask: Task | null = null;
  categories: Category[] = [];
  categoryLookup: Record<number, string> = {};
  searchInput: string = '';
  errorMessages: { dueDate: string; title: string; description: string } = { dueDate: '', title: '', description: '' };

  constructor(private taskService: TaskService, private categoryService: CategoryService) {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
      this.filterTasksByStatus();
    });

    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
      this.buildCategoryLookup();
    });
  }

  buildCategoryLookup(): void {
    this.categoryLookup = this.categories.reduce((lookup, category) => {
      if (category.id !== undefined) {
        lookup[category.id] = category.name;
      }
      return lookup;
    }, {} as Record<number, string>);
  }

  getCategoryName(id?: number): string {
    return id && this.categoryLookup[id] ? this.categoryLookup[id] : 'Unknown category';
  }

  filterTasksByStatus(): void {
    this.inProgressTasks = this.tasks.filter(task => task.status === 'in-progress');
    this.completedTasks = this.tasks.filter(task => task.status === 'completed');
    this.notStartedTasks = this.tasks.filter(task => task.status === 'not-started');
  }

  searchTasks(): void {
    this.taskService.searchTasks(this.searchInput).subscribe((filteredTasks) => {
      this.tasks = filteredTasks;
      this.filterTasksByStatus();
    });
  }

  getShadowClass(priority: string): string {
    switch (priority) {
      case 'low':
        return 'bg-indigo-600 shadow-inner';
      case 'medium':
        return 'bg-yellow-500 shadow-inner';
      case 'high':
        return 'bg-red-600 shadow-inner';
      default:
        return 'shadow-gray-600 shadow-inner';
    }
  }

  openTaskForm(task?: Task): void {
    this.isTaskFormOpen = true;
    this.formTask = task ? { ...task } : this.getEmptyTask();
    this.selectedTask = task || null;
  }

  closeTaskForm(): void {
    this.isTaskFormOpen = false;
    this.formTask = this.getEmptyTask();
  }

  saveTask(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(this.formTask.dueDate);
    this.errorMessages = {
      dueDate: '',
      title: '',
      description: ''
    };

    if (dueDate < today) {
      this.errorMessages.dueDate = 'Due date cannot be in the past';
    }

    if (this.formTask.title.length < 5) {
      this.errorMessages.title = 'Title must be at least 5 characters long';
    }

    if(this.formTask.title.length > 50) {
      this.errorMessages.title = 'Title must be at most 50 characters long';
    }

    if (this.formTask.description.length < 10) {
      this.errorMessages.description = 'Description must be at least 10 characters long';
    }

    if(this.formTask.description.length > 500){
      this.errorMessages.description = 'Description must be at most 500 characters long';
    }

    if (this.errorMessages.dueDate || this.errorMessages.title || this.errorMessages.description) {
      return;
    }

    if (this.selectedTask) {
      this.taskService.updateTask(this.formTask).subscribe(() => {
        this.loadTasks();
        this.closeTaskForm();
      });
    } else {
      this.taskService.createTask(this.formTask).subscribe(() => {
        this.loadTasks();
        this.closeTaskForm();
      });
    }
  }

  deleteTask(taskId?: number): void {
    this.taskService.deleteTask(taskId).subscribe(() => this.loadTasks());
  }

  private getEmptyTask(): Task {
    return {
      title: '',
      description: '',
      dueDate: new Date(),
      priority: 'low',
      status: 'not-started',
      categoryId: undefined,
    };
  }
}
