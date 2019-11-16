import { NgModule } from '@angular/core';
import { PeopleComponent } from './people.component';
import { CoreModule } from '@alfresco/adf-core';
import { SharesModule } from 'app/layout/shares/shares.module';
import { ContentModule } from '@alfresco/adf-content-services';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { PersonDetailComponent } from './person-detail/person-detail.component';

@NgModule({
  imports: [
    SharesModule,
    ExtensionsModule.forChild(),
    CoreModule.forChild(),
    ContentModule.forChild()
  ],
  declarations: [PeopleComponent, PersonDetailComponent],
  entryComponents: [PersonDetailComponent]
})
export class PeopleModule {}
