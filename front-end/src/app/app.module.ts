import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routes';

// App components
import { AppComponent } from './app.component';
import { AdminModule } from './layout/admin/admin.module';
import { SharesModule } from './layout/shares/shares.module';
import { LoginModule } from './pages/login/login.module';
import { CoreModule, TRANSLATION_PROVIDER } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { AppStoreModule } from 'app/store/app-store.module';
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import { MainPipe } from './pipes/pipe.module';
registerLocaleData(localeVi);
@NgModule({
  imports: [
    MainPipe,
    AppStoreModule,
    SharesModule,
    AppRoutingModule,
    RouterModule,
    AdminModule,
    BrowserAnimationsModule,
    LoginModule,
    // ADF modules
    CoreModule.forRoot(),
    ContentModule.forRoot()
  ],
  providers: [
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
