import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { LayoutRoutes } from 'app/layout/layout.routing';
import { ErrorComponent } from './pages/error/error.component';
export const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'APP.SIGN_IN'
    }
  },
  {
    path: 'error',
    children: [
      {
        path: '',
        redirectTo: '/error/404',
        pathMatch: 'full'
      },
      {
        path: ':id',
        component: ErrorComponent
      }
    ]
  }
  // ...LayoutRoutes
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
