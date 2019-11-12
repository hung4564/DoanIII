import { NgModule } from '@angular/core';
import { SharedLinkViewComponent } from './shared-link-view.component';
import { CoreModule } from '@alfresco/adf-core';
import { Routes } from '@angular/router';
import { CoreExtensionsModule } from '../../extensions/core.extensions.module';
import { SharesModule } from 'app/layout/shares/shares.module';

const routes: Routes = [
  {
    path: '',
    component: SharedLinkViewComponent,
    data: {
      title: 'APP.PREVIEW.TITLE'
    }
  }
];

@NgModule({
  imports: [CoreModule.forChild(), CoreExtensionsModule.forChild(), SharesModule],
  declarations: [SharedLinkViewComponent],
  exports: [SharedLinkViewComponent]
})
export class AppSharedLinkViewModule {}
