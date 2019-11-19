import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from "./pages/login/login.component";
import { ErrorComponent } from "./pages/error/error.component";
import { AuthGuardEcm } from "@alfresco/adf-core";
import { LayoutComponent } from "./layout/layout.component";
import { FilesComponent } from "./pages/files/files.component";
import { PreviewComponent } from "./pages/preview/preview.component";
import { FileTrashComponent } from "./pages/file-trash/file-trash.component";
import { SharedLinkViewComponent } from "./pages/shared-link-view/shared-link-view.component";
import { AppSharedRuleGuard } from "./routing/shared.guard";
import { FileShareComponent } from "./pages/file-share/file-share.component";
import { FileRecentComponent } from "./pages/file-recent/file-recent.component";
import { FileFavoriteComponent } from "./pages/file-favorite/file-favorite.component";
import { FileDetailComponent } from "./pages/files/file-detail/file-detail.component";
import { LibrariesComponent } from "./pages/libraries/libraries.component";
import { PeopleComponent } from "./pages/people/people.component";
import { GroupsMainComponent } from "./pages/groups/groups-main/groups-main.component";
import { SearchResultsComponent } from "./pages/search-result/search-results/search-results.component";
import { SearchLibrariesResultsComponent } from "./pages/search-result/search-libraries-results/search-libraries-results.component";
import { TaskComponent } from "./pages/task/task.component";
import { TaskDetailComponent } from "./pages/task/task-detail/task-detail.component";
import { TaskCreateComponent } from "./pages/task/task-create/task-create.component";
export const appRoutes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    data: {
      title: "APP.SIGN_IN"
    }
  },
  {
    path: "error",
    children: [
      {
        path: "",
        redirectTo: "/error/404",
        pathMatch: "full"
      },
      {
        path: ":id",
        component: ErrorComponent
      }
    ]
  },
  {
    path: "preview/s/:id",
    component: SharedLinkViewComponent,
    data: {
      title: "APP.PREVIEW.TITLE",
      navigateMultiple: true
    }
  },
  {
    path: "",
    canActivate: [AuthGuardEcm],
    component: LayoutComponent,
    children: [
      { path: "", redirectTo: "personal-files", pathMatch: "full" },
      {
        path: "personal-files",
        children: [
          {
            path: "",
            component: FilesComponent,
            data: {
              title: "APP.BROWSE.PERSONAL.TITLE",
              defaultNodeId: "-my-"
            }
          },
          {
            path: "file/:nodeId",
            component: FileDetailComponent,
            data: {
              title: "APP.BROWSE.PERSONAL.TITLE"
            }
          },
          {
            path: ":folderId",
            component: FilesComponent,
            data: {
              title: "APP.BROWSE.PERSONAL.TITLE"
            }
          },
          {
            path: "preview/:nodeId",
            component: PreviewComponent,
            data: {
              title: "APP.PREVIEW.TITLE",
              navigateSource: "personal-files"
            }
          },
          {
            path: ":folderId/preview/:nodeId",
            component: PreviewComponent,
            data: {
              title: "APP.PREVIEW.TITLE",
              navigateSource: "personal-files"
            }
          }
        ]
      },
      {
        path: "libraries",
        children: [
          {
            path: "",
            component: LibrariesComponent,
            data: {
              title: "APP.BROWSE.LIBRARIES.MENU.MY_LIBRARIES.TITLE"
            }
          }
        ]
      },
      {
        path: "favorites",
        children: [
          {
            path: "",
            component: FileFavoriteComponent,
            data: {
              title: "APP.BROWSE.FAVORITES.TITLE"
            }
          },
          {
            path: "preview/:nodeId",
            component: FileFavoriteComponent,
            data: {
              title: "APP.BROWSE.FAVORITES.TITLE",
              navigateSource: "favorites"
            }
          }
        ]
      },
      {
        path: "shared",
        children: [
          {
            path: "",
            component: FileShareComponent,
            data: {
              title: "APP.BROWSE.SHARED.TITLE"
            }
          },
          {
            path: "preview/:nodeId",
            component: PreviewComponent,
            data: {
              title: "APP.PREVIEW.TITLE",
              navigateSource: "personal-files"
            }
          }
        ],
        canActivateChild: [AppSharedRuleGuard],
        canActivate: [AppSharedRuleGuard]
      },
      {
        path: "recent-files",
        children: [
          {
            path: "",
            component: FileRecentComponent,
            data: {
              title: "APP.BROWSE.RECENT.TITLE"
            }
          },
          {
            path: "preview/:nodeId",
            component: FileRecentComponent,
            data: {
              title: "APP.BROWSE.RECENT.TITLE",
              navigateSource: "recent-files"
            }
          }
        ]
      },
      {
        path: "trashcan",
        component: FileTrashComponent,
        data: {
          title: "APP.BROWSE.TRASHCAN.TITLE"
        }
      },
      {
        path: "tasks",
        children: [
          {
            path: "",
            component: TaskComponent,
            data: {
              title: "APP.BROWSE.TASKS.TITLE"
            }
          },
          {
            path: "create",
            component: TaskCreateComponent,
            data: {
              title: "APP.BROWSE.TASKS.TITLE"
            }
          },
          {
            path: ":taskId",
            component: TaskDetailComponent,
            data: {
              title: "APP.BROWSE.TASKS.TITLE"
            }
          }
        ]
      },
      { path: "people", component: PeopleComponent, data: { title: "APP.BROWSE.PEOPLE.TITLE" } },
      {
        path: "groups",
        component: GroupsMainComponent,
        data: { title: "APP.BROWSE.GROUPS.TITLE" }
      },
      {
        path: "search",
        children: [
          {
            path: "",
            component: SearchResultsComponent,
            data: {
              title: "APP.BROWSE.SEARCH.TITLE"
            }
          },
          {
            path: "preview/:nodeId",
            children: [
              {
                path: "",
                data: {
                  navigateSource: "search"
                },
                component: PreviewComponent
              }
            ]
          }
        ]
      },
      {
        path: "search-libraries",
        children: [
          {
            path: "",
            component: SearchLibrariesResultsComponent,
            data: {
              title: "APP.BROWSE.SEARCH.TITLE"
            }
          },
          {
            path: "preview/:nodeId",
            children: [
              {
                path: "",
                data: {
                  navigateSource: "search-libraries"
                },
                component: PreviewComponent
              }
            ]
          }
        ]
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
