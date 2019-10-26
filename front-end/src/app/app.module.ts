import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routes';

// App components
import { AppComponent } from './app.component';
import { AdminModule } from './layout/admin/admin.module';
import { SharesModule } from './layout/shares/shares.module';
import { LoginModule } from './pages/login/login.Module';
import { CoreModule, TRANSLATION_PROVIDER, TranslateLoaderService } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
@NgModule({
  imports: [
    SharesModule,
    AppRoutingModule,
    RouterModule,
    AdminModule,
    BrowserAnimationsModule,
    LoginModule,
    // ADF modules
    CoreModule.forRoot(),
    ContentModule.forRoot(),
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useClass: TranslateLoaderService }
    })
  ],
  providers: [
    {
      provide: TRANSLATION_PROVIDER,
      multi: true,
      useValue: {
        name: 'app',
        source: 'resources'
      }
    }
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
