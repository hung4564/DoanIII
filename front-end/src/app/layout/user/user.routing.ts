import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserComponent } from './user.component';
import { AuthGuardEcm } from '@alfresco/adf-core';
import { HomeRoutes } from 'app/pages/home/home.routing';
import { FilesRoutes } from 'app/pages/files/files.routing';
import { FileViewComponent } from 'app/pages/files/file-view/file-view.component';
const userRoutes: Routes = [
  {
    path: '',
    component: UserComponent,
    canActivate: [AuthGuardEcm],
    children: [
      ...HomeRoutes,
      ...FilesRoutes,
      { path: 'files/:nodeId/view', component: FileViewComponent, outlet: 'overlay' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(userRoutes)],
  exports: [RouterModule],
  providers: []
})
export class UserRoutingModule {}
