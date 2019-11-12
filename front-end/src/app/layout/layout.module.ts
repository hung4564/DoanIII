import { NgModule } from '@angular/core';
import { SharesModule } from './shares/shares.module';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { SidenavComponent } from './partials//sidenav/sidenav.component';
import { HeaderComponent } from './partials/header/header.component';
import { CurrentUserComponent } from './partials/current-user/current-user.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { LayoutService } from './layout.service';
import { CoreExtensionsModule } from 'app/extensions/core.extensions.module';
import { ExtensionsModule } from '@alfresco/adf-extensions';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharesModule,
    CoreExtensionsModule.forChild(),
    CoreModule.forChild(),
    ContentModule.forChild(),
    ExtensionsModule
  ],
  declarations: [SidenavComponent, HeaderComponent, CurrentUserComponent, LayoutComponent],
  exports: [],
  providers: [LayoutService]
})
export class LayoutModule {}
