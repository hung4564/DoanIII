import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
@NgModule({
  imports: modules(),
  exports: [BrowserModule, FormsModule, ReactiveFormsModule, ...modules()]
})
export class SharesModule {}
export function modules() {
  return [CoreModule, ContentModule];
}
