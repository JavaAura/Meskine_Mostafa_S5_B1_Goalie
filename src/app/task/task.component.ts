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
      status: 'not-started'
    };
  }
}
