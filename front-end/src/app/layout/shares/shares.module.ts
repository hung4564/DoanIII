import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { TranslateModule } from '@ngx-translate/core';
import { MainPipe } from 'app/pipes/pipe.module';

@NgModule({
  imports: modules(),
  exports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    // MainPipe,
    ...modules()
  ]
})
export class SharesModule {}
export function modules() {
  return [CoreModule, ContentModule];
}
