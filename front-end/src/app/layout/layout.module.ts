import { NgModule } from '@angular/core';
import { SharesModule } from './shares/shares.module';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { AdminSidenavComponent } from './admin/part/sidenav/sidenav.component';
import { SidenavComponent } from './user/part/sidenav/sidenav.component';
import { HeaderComponent } from './partials/header/header.component';
import { CurrentUserComponent } from './partials/current-user/current-user.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { LayoutRoutingModule } from './layout.routing';
import { LayoutService } from './layout.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharesModule,
    CoreModule.forChild(),
    ContentModule.forChild(),
    LayoutRoutingModule
  ],
  declarations: [
    AdminSidenavComponent,
    SidenavComponent,
    HeaderComponent,
    CurrentUserComponent,
    LayoutComponent
  ],
  exports: [
    AdminSidenavComponent,
    SidenavComponent,
    HeaderComponent,
    CurrentUserComponent,
    LayoutComponent
  ],
  providers: [LayoutService]
})
export class LayoutModule {}
