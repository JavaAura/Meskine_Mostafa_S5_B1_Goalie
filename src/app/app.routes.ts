import { Routes } from '@angular/router';
import {CategoryComponent} from "./category/category.component";
import {TaskComponent} from "./task/task.component";

export const routes: Routes = [
  {path: 'category', component: CategoryComponent},
  {path: 'task', component: TaskComponent},
];
