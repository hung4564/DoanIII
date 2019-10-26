import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin.routing';

import { SharesModule } from 'app/layout/shares/shares.module';
import { UsersModule } from 'app/pages/users/users.module';
@NgModule({
  declarations: [AdminComponent],
  imports: [
    SharesModule,
    AdminRoutingModule,
    UsersModule,

  ]
})
export class AdminModule {}
