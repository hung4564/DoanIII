import { ContentModule } from "@alfresco/adf-content-services";
import { CoreModule } from "@alfresco/adf-core";
import { ExtensionsModule } from "@alfresco/adf-extensions";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharesModule } from "app/layout/shares/shares.module";
import { AppAdminRuleGuard } from "app/routing/admin.guard";
import { GroupViewListComponent } from "./group-view-list/group-view-list.component";
import { GroupsDetailComponent } from "./groups-detail/groups-detail.component";
import { GroupsMainComponent } from "./groups-main/groups-main.component";
const routes: Routes = [
  {
    path: "",
    component: GroupsMainComponent,
    data: {
      title: "APP.BROWSE.GROUPS.TITLE",
      disableShowInfoFile: true
    },
    canActivate: [AppAdminRuleGuard]
  }
];
@NgModule({
  imports: [
    SharesModule,
    RouterModule.forChild(routes),
    CoreModule.forChild(),
    ContentModule.forChild(),
    ExtensionsModule.forChild()
  ],
  declarations: [
    GroupsMainComponent,
    GroupsDetailComponent,
    GroupViewListComponent
  ],
  entryComponents: [GroupsDetailComponent, GroupViewListComponent]
})
export class GroupsModule {}
