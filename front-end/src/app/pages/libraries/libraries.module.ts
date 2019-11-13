import { NgModule } from '@angular/core';
import { LibrariesComponent } from './libraries.component';
import { SharesModule } from 'app/layout/shares/shares.module';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { ExtensionsModule } from '@alfresco/adf-extensions';

@NgModule({
  imports: [
    SharesModule,
    ExtensionsModule.forChild(),
    CoreModule.forChild(),
    ContentModule.forChild()
  ],
  declarations: [LibrariesComponent]
})
export class LibrariesModule {}
