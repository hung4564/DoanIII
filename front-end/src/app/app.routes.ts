import { AuthGuardEcm } from "@alfresco/adf-core";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LayoutComponent } from "./layout/layout.component";
import { ErrorComponent } from "./pages/error/error.component";
import { FilesComponent } from "./pages/files/files.component";
import { LoginComponent } from "./pages/login/login.component";
import { PreviewComponent } from "./pages/preview/preview.component";
import { AppSharedRuleGuard } from "./routing/shared.guard";

export const appRoutes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    data: {
      title: "APP.SIGN_IN"
    }
  },
  {
    path: "preview/s/:id",
    loadChildren:
      "app/pages/shared-link-view/shared-link-view.module#AppSharedLinkViewModule"
  },
  { path: "home", redirectTo: "personal-files" },
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
        loadChildren: "app/pages/libraries/libraries.module#LibrariesModule"
      },
      {
        path: "favorites",
        loadChildren:
          "app/pages/file-favorite/file-favorite.module#FileFavoriteModule"
      },
      {
        path: "shared",
        loadChildren: "app/pages/file-share/file-share.module#FileShareModule",
        canActivateChild: [AppSharedRuleGuard],
        canActivate: [AppSharedRuleGuard]
      },
      {
        path: "recent-files",
        loadChildren:
          "app/pages/file-recent/file-recent.module#FileRecentModule"
      },
      {
        path: "trashcan",
        loadChildren: "app/pages/file-trash/file-trash.module#FileTrashModule"
      },
      {
        path: "people",
        loadChildren: "app/pages/people/people.module#PeopleModule"
      },
      {
        path: "groups",
        loadChildren: "app/pages/groups/groups.module#GroupsModule"
      },
      {
        path: "search",
        loadChildren:
          "app/pages/search-result/search-result.module#SearchResultModule"
      },
      {
        path: "about",
        loadChildren: "app/pages/about/about.module#AboutModule"
      }
    ]
  },
  { path: "**", redirectTo: "error", pathMatch: "full" },
  {
    path: "error",
    children: [
      {
        path: "",
        redirectTo: "404",
        pathMatch: "full"
      },
      {
        path: ":id",
        component: ErrorComponent
      }
    ]
  }
];
@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
