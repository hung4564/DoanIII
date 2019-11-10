import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainPipe } from 'app/pipes/pipe.module';
import { MaterialModule } from './material.module';
import { PersonSearchComponent } from './person-search/person-search.component';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { CustomNameColumnComponent } from './name-column/name-column.component';
import { LocationLinkComponent } from './location-link/location-link.component';
import { LockByComponent } from './locked-by/locked-by.component';
import { DirectivesModule } from 'app/directives/directives.module';
import { NodePermissionsDialogComponent } from './permission-dialog/node-permissions.dialog';
import { NodeVersionUploadDialogComponent } from './node-version-upload/node-version-upload.dialog';
import { NodeVersionsDialogComponent } from './node-versions/node-versions.dialog';
import { AppNodeVersionFormComponent } from './node-version-form/node-version-form.component';
import { PermissionsManagerComponent } from './permission-manager/permission-manager.component';
export function components() {
  return [PersonSearchComponent, AppNodeVersionFormComponent, PermissionsManagerComponent];
}
export function dialogcomponents() {
  return [
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
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MainPipe,
    CoreModule.forRoot(),
    ContentModule.forRoot()
  ],
  exports: [
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
