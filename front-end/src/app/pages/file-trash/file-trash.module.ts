import { NgModule } from '@angular/core';
import { SharesModule } from 'app/layout/shares/shares.module';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { FileTrashComponent } from './file-trash.component';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { Routes } from '@angular/router';

@NgModule({
  imports: [
    SharesModule,
    ExtensionsModule.forChild(),
    CoreModule.forChild(),
    ContentModule.forChild()
  ],
  declarations: [FileTrashComponent],
  exports: [FileTrashComponent]
})
export class FileTrashModule {}
