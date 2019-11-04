import { Routes } from '@angular/router';
import { FilesComponent } from './files.component';
import { FileDetailComponent } from './file-detail/file-detail.component';

export const FilesRoutes: Routes = [
  { path: 'personal-files', component: FilesComponent },
  {
    path: 'file/:nodeId',
    component: FileDetailComponent
  }
];
