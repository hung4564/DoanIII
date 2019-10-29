import { NgModule } from '@angular/core';
import { GroupsService } from './groups.service';
import { SharesModule } from 'app/layout/shares/shares.module';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { GroupsMainComponent } from './groups-main/groups-main.component';
import { GroupsDetailComponent } from './groups-detail/groups-detail.component';
@NgModule({
  imports: [SharesModule, CoreModule.forChild(), ContentModule.forChild()],
  declarations: [GroupsMainComponent, GroupsDetailComponent],
  providers: [GroupsService],
  entryComponents: [GroupsDetailComponent]
})
export class GroupsModule {}
