import { ContentModule } from "@alfresco/adf-content-services";
import {
  CoreModule,
  TranslateLoaderService,
  TRANSLATION_PROVIDER
} from "@alfresco/adf-core";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouteReuseStrategy, RouterModule } from "@angular/router";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { ContentApiService } from "app/services/content-api.service";
import { AppStoreModule } from "app/store/app-store.module";
// App components
import { AppComponent } from "./app.component";
import { appRoutes } from "./app.routes";
import { AppExtensionService } from "./extensions/app-extension.service";
import { CoreExtensionsModule } from "./extensions/core.extensions.module";
import { LayoutModule } from "./layout/layout.module";
import { SharesModule } from "./layout/shares/shares.module";
import { ErrorModule } from "./pages/error/error.module";
import { FilesModule } from "./pages/files/files.module";
import { LoginModule } from "./pages/login/login.module";
import { AppAdminRuleGuard } from "./routing/admin.guard";
import { AppRouteReuseStrategy } from "./routing/app.routes.strategy";
import { AppSharedRuleGuard } from "./routing/shared.guard";
import { HandleService } from "./services/api.service";
import { AppService } from "./services/app.service";
import { ContentManagementService } from "./services/content-management.service";
import { NodeActionsService } from "./services/node-actions.service";
import { NodePermissionService } from "./services/node-permission.service";

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
    FilesModule,
    ErrorModule
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
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
