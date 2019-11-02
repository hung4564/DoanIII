import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainPipe } from 'app/pipes/pipe.module';
import { MaterialModule } from './material.module';
import { PersonSearchComponent } from './person-search/person-search.component';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { HeaderComponent } from 'app/layout/partials/header/header.component';
import { CurrentUserComponent } from 'app/layout/partials/current-user/current-user.component';
@NgModule({
  declarations: [PersonSearchComponent, HeaderComponent, CurrentUserComponent],
  imports: [
    MaterialModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MainPipe,
    CoreModule.forRoot(),
    ContentModule.forRoot()
  ],
  exports: [
    MaterialModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MainPipe,
    PersonSearchComponent,
    HeaderComponent,
    CurrentUserComponent
  ]
})
export class SharesModule {}
