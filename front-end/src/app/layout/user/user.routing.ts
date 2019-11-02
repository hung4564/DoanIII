import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserComponent } from './user.component';
import { AuthGuardEcm } from '@alfresco/adf-core';
import { HomeRoutes } from 'app/pages/home/home.routing';
const userRoutes: Routes = [
  {
    path: '',
    component: UserComponent,
    canActivate: [AuthGuardEcm],
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      },
      ...HomeRoutes
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(userRoutes)],
  exports: [RouterModule],
  providers: []
})
export class UserRoutingModule {}
