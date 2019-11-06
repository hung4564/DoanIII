import { Routes } from '@angular/router';
import { HomeRoutes } from 'app/pages/home/home.routing';
import { FilesRoutes } from 'app/pages/files/files.routing';
import { SidenavComponent } from './part/sidenav/sidenav.component';
import { MySitesRoutes } from 'app/pages/my-sites/my-sites.routing';
export const userRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: SidenavComponent,
        outlet: 'sidebar'
      },
      ...HomeRoutes,
      ...FilesRoutes,
      ...MySitesRoutes
    ]
  }
];
