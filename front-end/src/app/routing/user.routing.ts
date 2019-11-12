import { Routes } from '@angular/router';
import { HomeRoutes } from 'app/pages/home/home.routing';
import { MySitesRoutes } from 'app/pages/my-sites/my-sites.routing';
export const userRoutes: Routes = [
  {
    path: '',
    children: [
      ...HomeRoutes,
      ...MySitesRoutes
    ]
  }
];
