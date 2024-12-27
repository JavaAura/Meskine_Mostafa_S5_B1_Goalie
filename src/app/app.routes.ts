import {Routes} from '@angular/router';
import {CategoryComponent} from "./category/category.component";
import {TaskComponent} from "./task/task.component";
import {DashboardComponent} from "./dashboard/dashboard.component";

export const routes: Routes = [
  {path: 'category', component: CategoryComponent},
  {path: 'task', component: TaskComponent},
  {path: 'dashboard', component: DashboardComponent},
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
