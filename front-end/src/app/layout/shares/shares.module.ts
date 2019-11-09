import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainPipe } from 'app/pipes/pipe.module';
import { MaterialModule } from './material.module';
import { PersonSearchComponent } from './person-search/person-search.component';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { CustomNameColumnComponent } from './name-column/name-column.component';
import { LocationLinkComponent } from './location-link/location-link.component';
import { LockByComponent } from './locked-by/locked-by.component';

@NgModule({
  declarations: [
    PersonSearchComponent,
    CustomNameColumnComponent,
    LocationLinkComponent,
    LockByComponent
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
    CustomNameColumnComponent,
    LocationLinkComponent,
    LockByComponent
  ],
  entryComponents: [CustomNameColumnComponent, LocationLinkComponent, LockByComponent]
})
export class SharesModule {}
