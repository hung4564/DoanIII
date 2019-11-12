import { NgModule } from '@angular/core';
import { SharesModule } from 'app/layout/shares/shares.module';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { FileShareComponent } from './file-share.component';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { Routes } from '@angular/router';

@NgModule({
  imports: [
    SharesModule,
    ExtensionsModule.forChild(),
    CoreModule.forChild(),
    ContentModule.forChild()
  ],
  declarations: [FileShareComponent],
  exports: [FileShareComponent]
})
export class FileShareModule {}
