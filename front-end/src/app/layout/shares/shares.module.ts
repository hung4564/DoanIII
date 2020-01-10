import { ContentModule } from "@alfresco/adf-content-services";
import { CoreModule } from "@alfresco/adf-core";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DirectivesModule } from "app/directives/directives.module";
import { GroupViewListComponent } from "app/layout/shares/group-view-list/group-view-list.component";
import { PreviewComponent } from "app/pages/preview/preview.component";
import { MainPipe } from "app/pipes/pipe.module";
import { ChangeLibraryRoleComponent } from "./changeLibraryRole/changeLibraryRole.component";
import { CreateMenuComponent } from "./create-menu/create-menu.component";
import { CustomBtnComponent } from "./custom-btn/custom-btn.component";
import { GroupsDetailComponent } from "./groups-detail/groups-detail.component";
import { AppInfoDrawerModule } from "./info-drawer/info.drawer.module";
import { LocationLinkComponent } from "./location-link/location-link.component";
import { LockByComponent } from "./locked-by/locked-by.component";
import { MaterialModule } from "./material.module";
import { CustomNameColumnComponent } from "./name-column/name-column.component";
import { AppNodeVersionFormComponent } from "./node-version-form/node-version-form.component";
import { NodeVersionUploadDialogComponent } from "./node-version-upload/node-version-upload.dialog";
import { NodeVersionsDialogComponent } from "./node-versions/node-versions.dialog";
import { NodePermissionsDialogComponent } from "./permission-dialog/node-permissions.dialog";
import { PermissionsManagerComponent } from "./permission-manager/permission-manager.component";
import { PersonDetailComponent } from "./person-detail/person-detail.component";
import { PersonSearchComponent } from "./person-search/person-search.component";
import { AppToolbarModule } from "./toolbar/toolbar.module";
export function components() {
  return [
    CreateMenuComponent,
    AppNodeVersionFormComponent,
    PreviewComponent,
    PermissionsManagerComponent
  ];
}
export function dialogcomponents() {
  return [
    PersonDetailComponent,
    GroupsDetailComponent,
    GroupViewListComponent,
    PersonSearchComponent,
    ChangeLibraryRoleComponent,
    CustomBtnComponent,
    NodeVersionsDialogComponent,
    NodeVersionUploadDialogComponent,
    NodePermissionsDialogComponent,
    CustomNameColumnComponent,
    LocationLinkComponent,
    LockByComponent
  ];
}
@NgModule({
  declarations: [...components(), ...dialogcomponents()],
  imports: [
    FlexLayoutModule,
    AppInfoDrawerModule,
    AppToolbarModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MainPipe,
    CoreModule.forChild(),
    ContentModule.forChild()
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    AppInfoDrawerModule,
    AppToolbarModule,
    DirectivesModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MainPipe,
    ...components(),
    ...dialogcomponents()
  ],
  entryComponents: [...dialogcomponents()]
})
export class SharesModule {}
