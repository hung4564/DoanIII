import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin.routing';

import { SidenavComponent } from './part/sidenav/sidenav.component';
import { HeaderComponent } from './part/header/header.component';

import { SharesModule } from 'app/layout/shares/shares.module';
import { UsersModule } from 'app/pages/users/users.module';
@NgModule({
  declarations: [AdminComponent, SidenavComponent, HeaderComponent],
  imports: [SharesModule, AdminRoutingModule, UsersModule]
})
export class AdminModule {}
