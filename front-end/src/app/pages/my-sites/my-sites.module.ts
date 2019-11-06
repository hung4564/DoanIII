import { NgModule } from '@angular/core';
import { MySitesComponent } from './my-sites.component';
import { SharesModule } from 'app/layout/shares/shares.module';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';

@NgModule({
  imports: [SharesModule, CoreModule.forChild(), ContentModule.forChild()],
  declarations: [MySitesComponent]
})
export class MySitesModule {}
