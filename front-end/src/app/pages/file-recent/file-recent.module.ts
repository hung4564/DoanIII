import { NgModule } from '@angular/core';
import { SharesModule } from 'app/layout/shares/shares.module';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { FileRecentComponent } from './file-recent.component';
import { ExtensionsModule } from '@alfresco/adf-extensions';

@NgModule({
  imports: [
    SharesModule,
    ExtensionsModule.forChild(),
    CoreModule.forChild(),
    ContentModule.forChild()
  ],
  declarations: [FileRecentComponent],
  exports: [FileRecentComponent]
})
export class FileRecentModule {}
