import { CoreModule } from "@alfresco/adf-core";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AboutComponent } from "./about.component";
import { ExtensionListComponent } from "./extension-list/extension-list.component";
import { LicenseListComponent } from "./license-list/license-list.component";
import { ModuleListComponent } from "./module-list/module-list.component";
import { PackageListComponent } from "./package-list/package-list.component";
import { StatusListComponent } from "./status-list/status-list.component";

const routes: Routes = [
  {
    path: "",
    component: AboutComponent,
    data: {
      title: "APP.BROWSE.ABOUT.TITLE"
    }
  }
];
@NgModule({
  imports: [CoreModule.forChild(), RouterModule.forChild(routes)],
  declarations: [
    AboutComponent,
    PackageListComponent,
    ExtensionListComponent,
    StatusListComponent,
    ModuleListComponent,
    LicenseListComponent
  ]
})
export class AboutModule {}
