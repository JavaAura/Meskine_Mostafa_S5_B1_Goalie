import {Component, OnInit} from '@angular/core';
import {TaskService} from '../services/task.service';
import {DecimalPipe} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DecimalPipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent implements OnInit {
  totalTasks = 0;
  completedTasks = 0;
  pendingTasks = 0;
  overdueTasks = 0;
  completedPercentage = 0;
  pendingPercentage = 0;

  constructor(private taskService: TaskService) {
  }

  ngOnInit(): void {
    this.calculateStatistics();
  }

  calculateStatistics(): void {
    this.taskService.getTasks().subscribe((tasks) => {
      const now = new Date();

      this.totalTasks = tasks.length;
      this.completedTasks = tasks.filter((task) => task.status === 'completed').length;
      this.pendingTasks = tasks.filter(
        (task) => task.status !== 'completed' && new Date(task.dueDate) >= now
      ).length;
      this.overdueTasks = tasks.filter(
        (task) => task.status !== 'completed' && new Date(task.dueDate) < now
      ).length;

      // Calculate percentages
      this.completedPercentage = this.totalTasks
        ? (this.completedTasks / this.totalTasks) * 100
        : 0;

      this.pendingPercentage = this.totalTasks
        ? (this.pendingTasks / this.totalTasks) * 100
        : 0;
    });
  }
}
