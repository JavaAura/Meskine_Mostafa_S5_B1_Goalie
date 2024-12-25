import { Component } from '@angular/core';
import { Task } from '../models/task.model';
import { TaskService } from '../services/task.service';
import {FormsModule} from "@angular/forms";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";

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

  constructor(private taskService: TaskService) {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe((tasks) => (this.tasks = tasks));
    this.filterTasksByStatus();
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

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe(() => this.loadTasks());
  }

  private getEmptyTask(): Task {
    return {
      title: '',
      description: '',
      dueDate: new Date(),
      priority: 'low',
      status: 'not-started',
      categoryId: 0 // Default category
    };
  }
}
