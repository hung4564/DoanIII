import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin.routing';

import { SidenavComponent } from './part/sidenav/sidenav.component';
import { SharesModule } from 'app/layout/shares/shares.module';
import { UsersModule } from 'app/pages/users/users.module';

import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { GroupsModule } from 'app/pages/groups/groups.module';
import { SitesModule } from 'app/pages/sites/sites.module';
@NgModule({
  declarations: [AdminComponent, SidenavComponent],
  imports: [
    SharesModule,
    AdminRoutingModule,
    UsersModule,
    GroupsModule,
    SitesModule,
    CoreModule.forRoot(),
    ContentModule.forRoot()
  ]
})
export class AdminLayouModule {}
