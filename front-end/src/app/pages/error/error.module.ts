import { NgModule } from '@angular/core';
import { ErrorComponent } from './error.component';
import { CoreModule } from '@alfresco/adf-core';

@NgModule({
  imports: [CoreModule.forChild()],
  declarations: [ErrorComponent]
})
export class ErrorModule {}
