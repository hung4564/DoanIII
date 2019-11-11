import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { adminRoutes } from 'app/routing/admin.routing';
import { userRoutes } from 'app/routing/user.routing';
import { FileViewComponent } from 'app/pages/files/file-view/file-view.component';
import { LayoutComponent } from './layout.component';
import { AuthGuardEcm } from '@alfresco/adf-core';

export const LayoutRoutes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardEcm],
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'personal-files', pathMatch: 'full' },
      ...adminRoutes,
      ...userRoutes
    ]
  },
  {
    path: 'files/:nodeId/view',
    component: FileViewComponent,
    outlet: 'overlay',
    data: {
      title: 'APP.PREVIEW.TITLE'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(LayoutRoutes)],
  exports: [RouterModule],
  providers: []
})
export class LayoutRoutingModule {}
