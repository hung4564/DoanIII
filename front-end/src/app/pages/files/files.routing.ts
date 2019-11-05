import { Routes } from '@angular/router';
import { FilesComponent } from './files.component';
import { FileDetailComponent } from './file-detail/file-detail.component';
import { FileTrashComponent } from './file-trash/file-trash.component';
import { FileShareComponent } from './file-share/file-share.component';

export const FilesRoutes: Routes = [
  {
    path: 'personal-files',
    component: FilesComponent,
    data: {
      title: 'APP.BROWSE.PERSONAL.TITLE'
    }
  },
  {
    path: 'file/:nodeId',
    component: FileDetailComponent,
    data: {
      title: 'APP.BROWSE.PERSONAL.TITLE'
    }
  },
  {
    path: 'trash-can',
    component: FileTrashComponent,
    data: {
      title: 'APP.BROWSE.TRASHCAN.TITLE'
    }
  },

  {
    path: 'shared',
    component: FileShareComponent,
    data: {
      title: 'APP.BROWSE.SHARED.TITLE'
    }
  }
];
