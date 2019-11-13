import { Routes } from '@angular/router';
import { HomeRoutes } from 'app/pages/home/home.routing';
export const userRoutes: Routes = [
  {
    path: '',
    children: [
      ...HomeRoutes,
    ]
  }
];
