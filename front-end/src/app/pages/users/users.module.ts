import { NgModule } from '@angular/core';
import { UsersMainComponent } from './users-main/users-main.component';
import { SharesModule } from 'app/layout/shares/shares.module';
@NgModule({
  imports: [SharesModule],
  declarations: [UsersMainComponent]
})
export class UsersModule {}
