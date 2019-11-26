import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { RouterModule, RouteReuseStrategy } from "@angular/router";
import { appRoutes } from "./app.routes";

// App components
import { AppComponent } from "./app.component";
import { SharesModule } from "./layout/shares/shares.module";
import { LoginModule } from "./pages/login/login.module";
import {
  CoreModule,
  TRANSLATION_PROVIDER,
  TranslateLoaderService
} from "@alfresco/adf-core";
import { ContentModule } from "@alfresco/adf-content-services";

import { AppStoreModule } from "app/store/app-store.module";
import { AppService } from "./services/app.service";
import { HandleService } from "./services/api.service";
import { AppRouteReuseStrategy } from "./routing/app.routes.strategy";
import { LayoutModule } from "./layout/layout.module";
import { HomeModule } from "./pages/home/home.module";
import { FilesModule } from "./pages/files/files.module";
import { ErrorModule } from "./pages/error/error.module";
import { AppExtensionService } from "./extensions/app-extension.service";
import { CoreExtensionsModule } from "./extensions/core.extensions.module";

import { ContentApiService } from "app/services/content-api.service";
import { NodePermissionService } from "./services/node-permission.service";
import { NodeActionsService } from "./services/node-actions.service";
import { ContentManagementService } from "./services/content-management.service";
import { PreviewComponent } from "./pages/preview/preview.component";
import { FileTrashModule } from "./pages/file-trash/file-trash.module";
import { AppSharedLinkViewModule } from "./pages/shared-link-view/shared-link-view.module";
import { FileShareModule } from "./pages/file-share/file-share.module";
import { FileRecentModule } from "./pages/file-recent/file-recent.module";
import { FileFavoriteModule } from "./pages/file-favorite/file-favorite.module";
import { LibrariesModule } from "./pages/libraries/libraries.module";
import { PeopleModule } from "./pages/people/people.module";
import { GroupsModule } from "./pages/groups/groups.module";
import { SearchResultModule } from "./pages/search-result/search-result.module";
import { TaskModule } from "./pages/task/task.module";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { AppAdminRuleGuard } from "./routing/admin.guard";
import { AppSharedRuleGuard } from "./routing/shared.guard";
import { AboutModule } from "./pages/about/about.module";
@NgModule({
  imports: [
    AppStoreModule,
    SharesModule,
    RouterModule,
    BrowserAnimationsModule,
    LoginModule,
    RouterModule.forRoot(appRoutes, {
      useHash: false,
      enableTracing: false // enable for debug only
    }),
    // ADF modules
    CoreModule.forRoot(),
    ContentModule.forRoot(),
    CoreExtensionsModule.forRoot(),
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useClass: TranslateLoaderService }
    }),
    LayoutModule,
    HomeModule,
    FilesModule,
    ErrorModule,
    FileTrashModule,
    AppSharedLinkViewModule,
    FileShareModule,
    FileRecentModule,
    FileFavoriteModule,
    LibrariesModule,
    PeopleModule,
    GroupsModule,
    SearchResultModule,
    TaskModule,
    AboutModule
  ],
  providers: [
    AppService,
    AppAdminRuleGuard,
    AppSharedRuleGuard,
    HandleService,
    AppExtensionService,
    ContentApiService,
    NodePermissionService,
    NodeActionsService,
    ContentManagementService,
    { provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy },
    {
      provide: TRANSLATION_PROVIDER,
      multi: true,
      useValue: {
        name: "app",
        source: "assets"
      }
    }
  ],
  declarations: [AppComponent, PreviewComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
