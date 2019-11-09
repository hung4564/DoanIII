import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { AppRoutingModule } from './app.routes';

// App components
import { AppComponent } from './app.component';
import { SharesModule } from './layout/shares/shares.module';
import { LoginModule } from './pages/login/login.module';
import { CoreModule, TRANSLATION_PROVIDER } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { AppStoreModule } from 'app/store/app-store.module';
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import { AppService } from './services/app.service';
import { HandleService } from './services/api.service';
import { AppRouteReuseStrategy } from './routing/app.routes.strategy';
import { PreviewService } from './services/preview.service';
registerLocaleData(localeVi);

import { UsersModule } from 'app/pages/users/users.module';
import { GroupsModule } from 'app/pages/groups/groups.module';
import { SitesModule } from 'app/pages/sites/sites.module';
import { LayoutModule } from './layout/layout.module';
import { HomeModule } from './pages/home/home.module';
import { FilesModule } from './pages/files/files.module';
import { MySitesModule } from './pages/my-sites/my-sites.module';
import { ErrorModule } from './pages/error/error.module';
import { AppExtensionService } from './extensions/app-extension.service';
import { CoreExtensionsModule } from './extensions/core.extensions.module';

import { ContentApiService } from 'app/services/content-api.service';
@NgModule({
  imports: [
    AppStoreModule,
    SharesModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    LoginModule,
    // ADF modules
    CoreModule.forRoot(),
    ContentModule.forRoot(),
    CoreExtensionsModule.forRoot(),
    LayoutModule,
    UsersModule,
    GroupsModule,
    SitesModule,
    HomeModule,
    FilesModule,
    ErrorModule,
    MySitesModule
  ],
  providers: [
    AppService,
    HandleService,
    PreviewService,
    AppExtensionService,
    ContentApiService,
    { provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy },
    {
      provide: TRANSLATION_PROVIDER,
      multi: true,
      useValue: {
        name: 'app',
        source: 'assets'
      }
    }
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
