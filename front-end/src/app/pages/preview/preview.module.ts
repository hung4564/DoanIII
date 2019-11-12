import { CoreModule } from '@alfresco/adf-core';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentDirectiveModule } from '@alfresco/adf-content-services';
import { PreviewComponent } from './preview.component';
import { SharesModule } from 'app/layout/shares/shares.module';

const routes: Routes = [
  {
    path: '',
    component: PreviewComponent,
    data: {
      title: 'APP.PREVIEW.TITLE',
      navigateMultiple: true
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CoreModule.forChild(),
    ContentDirectiveModule,
    SharesModule
  ],
  declarations: [PreviewComponent],
  exports: [PreviewComponent]
})
export class PreviewModule {}
