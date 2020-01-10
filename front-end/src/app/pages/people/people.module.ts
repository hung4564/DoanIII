import { ContentModule } from "@alfresco/adf-content-services";
import { CoreModule } from "@alfresco/adf-core";
import { ExtensionsModule } from "@alfresco/adf-extensions";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharesModule } from "app/layout/shares/shares.module";
import { AppAdminRuleGuard } from "app/routing/admin.guard";
import { PeopleComponent } from "./people.component";
import { PersonDetailComponent } from "./person-detail/person-detail.component";

const routes: Routes = [
  {
    path: "",
    component: PeopleComponent,
    data: { title: "APP.BROWSE.PEOPLE.TITLE", disableShowInfoFile: true },
    canActivate: [AppAdminRuleGuard]
  }
];
@NgModule({
  imports: [
    SharesModule,
    RouterModule.forChild(routes),
    ExtensionsModule.forChild(),
    CoreModule.forChild(),
    ContentModule.forChild()
  ],
  declarations: [PeopleComponent, PersonDetailComponent],
  entryComponents: [PersonDetailComponent]
})
export class PeopleModule {}
