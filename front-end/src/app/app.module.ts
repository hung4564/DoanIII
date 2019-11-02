import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { AppRoutingModule } from './app.routes';

// App components
import { AppComponent } from './app.component';
import { AdminLayouModule } from './layout/admin/admin.module';
import { UserLayoutModule } from './layout/user/user.module';
import { SharesModule } from './layout/shares/shares.module';
import { LoginModule } from './pages/login/login.module';
import {
  CoreModule,
  TRANSLATION_PROVIDER,
  AppConfigService,
  DebugAppConfigService
} from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { AppStoreModule } from 'app/store/app-store.module';
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import { AppService } from './services/app.service';
import { HandleService } from './services/api.service';
import { ContentApiService } from './services/content-api.service';
import { AppRouteReuseStrategy } from './routing/app.routes.strategy';
registerLocaleData(localeVi);
@NgModule({
  imports: [
    AppStoreModule,
    SharesModule,
    AppRoutingModule,
    RouterModule,
    AdminLayouModule,
    UserLayoutModule,
    BrowserAnimationsModule,
    LoginModule,
    // ADF modules
    CoreModule.forRoot(),
    ContentModule.forRoot()
  ],
  providers: [
    AppService,
    HandleService,
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
