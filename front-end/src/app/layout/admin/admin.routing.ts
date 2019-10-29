import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { AuthGuardEcm } from '@alfresco/adf-core';

import { UsersRoutes } from 'app/pages/users/users.routing';
import { GroupsRoutes } from 'app/pages/groups/groups.routing';
const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuardEcm],
    children: [
      {
        path: '',
        redirectTo: '/users',
        pathMatch: 'full'
      },
      ...UsersRoutes,
      ...GroupsRoutes
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(adminRoutes)],
  exports: [RouterModule],
  providers: []
})
export class AdminRoutingModule {}
