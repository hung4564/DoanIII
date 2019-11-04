import { Routes } from '@angular/router';
import { FilesComponent } from './files.component';
import { FileViewComponent } from './file-view/file-view.component';

export const FilesRoutes: Routes = [
  { path: 'personal-files', component: FilesComponent }
];
