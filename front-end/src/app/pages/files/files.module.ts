import { NgModule } from '@angular/core';
import { FilesComponent } from './files.component';
import { SharesModule } from 'app/layout/shares/shares.module';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { FileViewComponent } from './file-view/file-view.component';

@NgModule({
  imports: [SharesModule, CoreModule.forChild(), ContentModule.forChild()],
  declarations: [FilesComponent, FileViewComponent]
})
export class FilesModule {}
