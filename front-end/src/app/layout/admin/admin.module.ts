import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin.routing';

import { SidenavComponent } from './part/sidenav/sidenav.component';
import { HeaderComponent } from './part/header/header.component';
import { CurrentUserComponent } from './part/current-user/current-user.component';

import { SharesModule } from 'app/layout/shares/shares.module';
import { UsersModule } from 'app/pages/users/users.module';

import { ApiService } from 'app/services/api.service';
import { AppService } from 'app/services/app.service';
import { RouteReuseStrategy } from '@angular/router';
import { AppRouteReuseStrategy } from 'app/routing/app.routes.strategy';

import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { GroupsModule } from 'app/pages/groups/groups.module';
@NgModule({
  declarations: [AdminComponent, SidenavComponent, HeaderComponent, CurrentUserComponent],
  imports: [
    SharesModule,
    AdminRoutingModule,
    UsersModule,
    GroupsModule,
    CoreModule.forChild(),
    ContentModule.forChild()
  ],
  providers: [
    AppService,
    ApiService,
    { provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy }
  ]
})
export class AdminModule {}
