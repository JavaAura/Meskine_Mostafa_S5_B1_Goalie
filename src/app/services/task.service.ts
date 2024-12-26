import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [];
  private nextId = 1;

  /**
   * Get the list of all tasks.
   * @returns Observable of task list.
   */
  getTasks(): Observable<Task[]> {
    return of(this.tasks);
  }

  /**
   * Create a new task.
   * @param task The task to create.
   * @returns Observable of the created task.
   */
  createTask(task: Task): Observable<Task> {
    if (!task.title.trim()) {
      throw new Error('Task title must not be empty');
    }

    task.id = this.nextId++;
    this.tasks.push(task);
    return of(task);
  }

  /**
   * Update an existing task.
   * @param updatedTask The task with updated information.
   * @returns Observable of the updated task list.
   */
  updateTask(updatedTask: Task): Observable<Task[]> {
    const taskIndex = this.tasks.findIndex((task) => task.id === updatedTask.id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    this.tasks[taskIndex] = updatedTask;
    return of(this.tasks);
  }

  /**
   * Delete a task by its ID.
   * @param taskId The ID of the task to delete.
   * @returns Observable of the updated task list.
   */
  deleteTask(taskId?: number): Observable<Task[]> {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    return of(this.tasks);
  }
}
