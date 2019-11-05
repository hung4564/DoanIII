import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainPipe } from 'app/pipes/pipe.module';
import { MaterialModule } from './material.module';
import { PersonSearchComponent } from './person-search/person-search.component';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { NodeVersionsDialogComponent } from './node-versions/node-versions.component';
import { NodeVersionUploadDialogComponent } from './node-version-upload/node-version-upload.component';
import { NodePermissionsDialogComponent } from './permission-dialog/permission-dialog.component';
import { AppNodeVersionFormComponent } from './node-version/node-version-form.component';
import { PermissionsManagerComponent } from './permission-manager/permission-manager.component';

@NgModule({
  declarations: [
    PersonSearchComponent,
    NodeVersionsDialogComponent,
    NodeVersionUploadDialogComponent,
    NodePermissionsDialogComponent,
    AppNodeVersionFormComponent,
    PermissionsManagerComponent
  ],
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MainPipe,
    CoreModule.forRoot(),
    ContentModule.forRoot()
  ],
  exports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MainPipe,
    PersonSearchComponent,
    NodeVersionsDialogComponent,
    NodeVersionUploadDialogComponent,
    NodePermissionsDialogComponent,
    AppNodeVersionFormComponent,
    PermissionsManagerComponent
  ],
  entryComponents: [AppNodeVersionFormComponent]
})
export class SharesModule {}
