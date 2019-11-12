import { NgModule } from '@angular/core';
import { FilesComponent } from './files.component';
import { SharesModule } from 'app/layout/shares/shares.module';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { FileDetailComponent } from './file-detail/file-detail.component';
import { ExtensionsModule } from '@alfresco/adf-extensions';

@NgModule({
  imports: [
    SharesModule,
    ExtensionsModule.forChild(),
    CoreModule.forChild(),
    ContentModule.forChild()
  ],
  declarations: [
    FilesComponent,
    FileDetailComponent,
  ]
})
export class FilesModule {}
