import { Routes } from '@angular/router';

import { UsersRoutes } from 'app/pages/users/users.routing';
import { GroupsRoutes } from 'app/pages/groups/groups.routing';
import { SitesRoutes } from 'app/pages/sites/sites.routing';
export const adminRoutes: Routes = [
  {
    path: 'admin',
    children: [
      {
        path: '',
        redirectTo: '/admin/users',
        pathMatch: 'full'
      },
      ...UsersRoutes,
      ...GroupsRoutes,
      ...SitesRoutes
    ]
  }
];
