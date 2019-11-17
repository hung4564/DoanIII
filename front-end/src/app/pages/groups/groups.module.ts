import { NgModule } from '@angular/core';
import { SharesModule } from 'app/layout/shares/shares.module';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { GroupsMainComponent } from './groups-main/groups-main.component';
import { GroupsDetailComponent } from './groups-detail/groups-detail.component';
import { GroupViewListComponent } from './group-view-list/group-view-list.component';
import { ExtensionsModule } from '@alfresco/adf-extensions';
@NgModule({
  imports: [
    SharesModule,
    CoreModule.forChild(),
    ContentModule.forChild(),
    ExtensionsModule.forChild()
  ],
  declarations: [GroupsMainComponent, GroupsDetailComponent, GroupViewListComponent],
  entryComponents: [GroupsDetailComponent, GroupViewListComponent]
})
export class GroupsModule {}
