import { NgModule } from '@angular/core';
import { UsersMainComponent } from './users-main/users-main.component';
import { UsersDetailComponent } from './users-detail/users-detail.component';
import { SharesModule } from 'app/layout/shares/shares.module';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { UsersService } from './users.service';
@NgModule({
  imports: [SharesModule, CoreModule.forChild(), ContentModule.forChild()],
  declarations: [UsersMainComponent, UsersDetailComponent],
  providers: [UsersService],
  entryComponents: [UsersDetailComponent]
})
export class UsersModule {}
