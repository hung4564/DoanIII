import { Routes } from '@angular/router';
import { FilesComponent } from './files.component';
import { FileDetailComponent } from './file-detail/file-detail.component';
import { FileTrashComponent } from './file-trash/file-trash.component';
import { FileShareComponent } from './file-share/file-share.component';
import { FileRecentComponent } from './file-recent/file-recent.component';
import { FileFavoriteComponent } from './file-favorite/file-favorite.component';

export const FilesRoutes: Routes = [
  {
    path: 'personal-files',
    component: FilesComponent,
    data: {
      title: 'APP.BROWSE.PERSONAL.TITLE',
      defaultNodeId: '-my-'
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
  },
  {
    path: 'favorites',
    component: FileFavoriteComponent,
    data: {
      title: 'APP.BROWSE.FAVORITES.TITLE'
    }
  },
  {
    path: 'recent',
    component: FileRecentComponent,
    data: {
      title: 'APP.BROWSE.RECENT.TITLE'
    }
  }
];
