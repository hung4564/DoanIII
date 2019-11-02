import { NgModule } from '@angular/core';
import { UserComponent } from './user.component';

import { UserRoutingModule } from './user.routing';

import { SidenavComponent } from './part/sidenav/sidenav.component';
import { SharesModule } from '../shares/shares.module';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { HomeModule } from 'app/pages/home/home.module';

@NgModule({
  declarations: [UserComponent, SidenavComponent],
  imports: [
    SharesModule,
    UserRoutingModule,
    CoreModule.forRoot(),
    ContentModule.forRoot(),
    HomeModule
  ]
})
export class UserLayoutModule {}
