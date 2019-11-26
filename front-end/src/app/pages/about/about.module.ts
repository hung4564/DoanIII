import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AboutComponent } from "./about.component";
import { CommonModule } from "@angular/common";
import { CoreModule } from "@alfresco/adf-core";
import { MatTableModule } from "@angular/material/table";
import { PackageListComponent } from "./package-list/package-list.component";
import { ExtensionListComponent } from "./extension-list/extension-list.component";
import { StatusListComponent } from "./status-list/status-list.component";
import { ModuleListComponent } from "./module-list/module-list.component";
import { LicenseListComponent } from "./license-list/license-list.component";

@NgModule({
  imports: [CoreModule.forChild()],
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
