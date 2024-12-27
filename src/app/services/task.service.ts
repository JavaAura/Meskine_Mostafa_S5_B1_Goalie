import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [];
  private nextId = 1;
  private localStorageKey = 'tasks';

  constructor() {
    this.loadTasksFromStorage();
  }

  /**
   * Load tasks from local storage when the service initializes.
   */
  private loadTasksFromStorage(): void {
    const storedTasks = localStorage.getItem(this.localStorageKey);
    this.tasks = storedTasks ? JSON.parse(storedTasks) : [];
    this.nextId = this.tasks.length > 0 ? Math.max(...this.tasks.map(task => task.id || 0)) + 1 : 1;
  }

  /**
   * Save tasks to local storage.
   */
  private saveTasksToStorage(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.tasks));
  }

  /**
   * Get the list of all tasks.
   */
  getTasks(): Observable<Task[]> {
    return of(this.tasks);
  }

  /**
   * Create a new task.
   */
  createTask(task: Task): Observable<Task> {
    if (!task.title.trim()) {
      throw new Error('Task title must not be empty');
    }

    task.id = this.nextId++;
    this.tasks.push(task);
    this.saveTasksToStorage();
    return of(task);
  }

  /**
   * Update an existing task.
   */
  updateTask(updatedTask: Task): Observable<Task[]> {
    if (!updatedTask.id) {
      throw new Error('Task ID is required for update');
    }

    const taskIndex = this.tasks.findIndex((task) => task.id === updatedTask.id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    this.tasks[taskIndex] = updatedTask;
    this.saveTasksToStorage();
    return of(this.tasks);
  }

  /**
   * Delete a task by its ID.
   */
  deleteTask(taskId?: number): Observable<Task[]> {
    if (!taskId) {
      throw new Error('Task ID is required for deletion');
    }

    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.saveTasksToStorage();
    return of(this.tasks);
  }

  /**
   * Search tasks by title or description.
   */
  searchTasks(searchTerm: string): Observable<Task[]> {
    if (!searchTerm.trim()) {
      return of(this.tasks);
    }

    const lowerCaseTerm = searchTerm.toLowerCase();
    const filteredTasks = this.tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(lowerCaseTerm) ||
        (task.description && task.description.toLowerCase().includes(lowerCaseTerm))
    );

    return of(filteredTasks);
  }
}
