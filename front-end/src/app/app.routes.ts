import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { LayoutRoutes } from 'app/layout/layout.routing';
import { ErrorComponent } from './pages/error/error.component';
import { AuthGuardEcm } from '@alfresco/adf-core';
import { LayoutComponent } from './layout/layout.component';
import { FileViewComponent } from './pages/files/file-view/file-view.component';
import { FilesComponent } from './pages/files/files.component';
import { PreviewComponent } from './pages/preview/preview.component';
import { FileTrashComponent } from './pages/file-trash/file-trash.component';
import { SharedLinkViewComponent } from './pages/shared-link-view/shared-link-view.component';
import { AppSharedRuleGuard } from './routing/shared.guard';
import { FileShareComponent } from './pages/file-share/file-share.component';
import { FileRecentComponent } from './pages/file-recent/file-recent.component';
import { FileFavoriteComponent } from './pages/file-favorite/file-favorite.component';
import { FileDetailComponent } from './pages/files/file-detail/file-detail.component';
import { LibrariesComponent } from './pages/libraries/libraries.component';
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
  },
  {
    path: 'preview/s/:id',
    component: SharedLinkViewComponent,
    data: {
      title: 'APP.PREVIEW.TITLE',
      navigateMultiple: true
    }
  },
  {
    path: '',
    canActivate: [AuthGuardEcm],
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'personal-files', pathMatch: 'full' },
      {
        path: 'personal-files',
        children: [
          {
            path: '',
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
            path: ':folderId',
            component: FilesComponent,
            data: {
              title: 'APP.BROWSE.PERSONAL.TITLE'
            }
          },
          {
            path: 'preview/:nodeId',
            component: PreviewComponent,
            data: {
              title: 'APP.PREVIEW.TITLE',
              navigateSource: 'personal-files'
            }
          },
          {
            path: ':folderId/preview/:nodeId',
            component: PreviewComponent,
            data: {
              title: 'APP.PREVIEW.TITLE',
              navigateSource: 'personal-files'
            }
          }
        ]
      },
      {
        path: 'libraries',
        children: [
          {
            path: '',
            component: LibrariesComponent,
            data: {
              title: 'APP.BROWSE.LIBRARIES.MENU.MY_LIBRARIES.TITLE'
            }
          }
        ]
      },
      {
        path: 'favorites',
        children: [
          {
            path: '',
            component: FileFavoriteComponent,
            data: {
              title: 'APP.BROWSE.FAVORITES.TITLE'
            }
          },
          {
            path: 'preview/:nodeId',
            component: FileFavoriteComponent,
            data: {
              title: 'APP.BROWSE.FAVORITES.TITLE',
              navigateSource: 'favorites'
            }
          }
        ]
      },
      {
        path: 'shared',
        children: [
          {
            path: '',
            component: FileShareComponent,
            data: {
              title: 'APP.BROWSE.SHARED.TITLE'
            }
          },
          {
            path: 'preview/:nodeId',
            component: PreviewComponent,
            data: {
              title: 'APP.PREVIEW.TITLE',
              navigateSource: 'personal-files'
            }
          }
        ],
        canActivateChild: [AppSharedRuleGuard],
        canActivate: [AppSharedRuleGuard]
      },
      {
        path: 'recent-files',
        children: [
          {
            path: '',
            component: FileRecentComponent,
            data: {
              title: 'APP.BROWSE.RECENT.TITLE'
            }
          },
          {
            path: 'preview/:nodeId',
            component: FileRecentComponent,
            data: {
              title: 'APP.BROWSE.RECENT.TITLE',
              navigateSource: 'recent-files'
            }
          }
        ]
      },
      {
        path: 'trashcan',
        component: FileTrashComponent,
        data: {
          title: 'APP.BROWSE.TRASHCAN.TITLE'
        }
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
