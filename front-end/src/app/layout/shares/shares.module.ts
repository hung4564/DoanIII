import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainPipe } from 'app/pipes/pipe.module';
import { MaterialModule } from './material.module';
import { PersonSearchComponent } from './person-search/person-search.component';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
@NgModule({
  declarations: [PersonSearchComponent],
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MainPipe,
    CoreModule.forRoot(),
    ContentModule.forRoot()
  ],
  exports: [MaterialModule, FormsModule, ReactiveFormsModule, MainPipe, PersonSearchComponent]
})
export class SharesModule {}
