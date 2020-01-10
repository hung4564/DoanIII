import { ContentModule } from "@alfresco/adf-content-services";
import { CoreModule } from "@alfresco/adf-core";
import { ExtensionsModule } from "@alfresco/adf-extensions";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharesModule } from "app/layout/shares/shares.module";
import { PreviewComponent } from "../preview/preview.component";
import { FavoriteLibrariesComponent } from "./favorite-libraries/favorite-libraries.component";
import { LibraiesPendingComponent } from "./libraies-pending/libraies-pending.component";
import { LibrariesApproveComponent } from "./libraries-approve/libraries-approve.component";
import { LibrariesDetailComponent } from "./libraries-detail/libraries-detail.component";
import { LibrariesDocumentComponent } from "./libraries-document/libraries-document.component";
import { LibrariesMemberComponent } from "./libraries-member/libraries-member.component";
import { LibrariesSettingComponent } from "./libraries-setting/libraries-setting.component";
import { LibrariesComponent } from "./libraries.component";
import { LibraryService } from "./library.service";
const routes: Routes = [
  { path: "", redirectTo: "all", pathMatch: "full" },
  {
    path: "all",
    component: LibrariesComponent,
    data: {
      title: "APP.BROWSE.LIBRARIES.MENU.MY_LIBRARIES.TITLE"
    }
  },
  {
    path: "favorite",
    children: [
      {
        path: "",
        component: FavoriteLibrariesComponent,
        data: {
          title: "APP.BROWSE.LIBRARIES.MENU.FAVORITE_LIBRARIES.TITLE"
        }
      }
    ]
  },
  {
    path: ":id",
    component: LibrariesDetailComponent,
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "library"
      },
      {
        path: "library",
        component: LibrariesDocumentComponent,
        data: {
          useParent: true
        }
      },
      {
        path: "approve",
        component: LibrariesApproveComponent,
        data: {
          useParent: true,
          disableShowInfoFile: true,
          disableShowCopyNode: true,
          disableShowfavoriteNode: true
        }
      },
      {
        path: "members",
        component: LibrariesMemberComponent,
        data: {
          useParent: true,
          disableShowInfoFile: true,
          disableShowCopyNode: true,
          disableShowfavoriteNode: true
        }
      },
      {
        path: "pendings",
        component: LibraiesPendingComponent,
        data: {
          useParent: true,
          disableShowInfoFile: true,
          disableShowCopyNode: true,
          disableShowfavoriteNode: true
        }
      },
      {
        path: "setting",
        component: LibrariesSettingComponent,
        data: {
          useParent: true,
          disableShowInfoFile: true,
          disableShowCopyNode: true,
          disableShowfavoriteNode: true
        }
      },
      {
        path: "preview/:nodeId",
        component: PreviewComponent,
        data: {
          title: "APP.PREVIEW.TITLE"
        }
      }
    ]
  },
  {
    path: "preview/:nodeId",
    component: PreviewComponent,
    data: {
      title: "APP.PREVIEW.TITLE"
    }
  }
];
@NgModule({
  imports: [
    SharesModule,
    RouterModule.forChild(routes),
    ExtensionsModule.forChild(),
    CoreModule.forChild(),
    ContentModule.forChild()
  ],
  declarations: [
    LibrariesApproveComponent,
    LibrariesSettingComponent,
    FavoriteLibrariesComponent,
    LibrariesComponent,
    LibrariesDetailComponent,
    LibrariesDocumentComponent,
    LibrariesMemberComponent,
    LibraiesPendingComponent
  ],
  providers: [LibraryService]
})
export class LibrariesModule {}
