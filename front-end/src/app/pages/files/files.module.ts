import { NgModule } from '@angular/core';
import { FilesComponent } from './files.component';
import { SharesModule } from 'app/layout/shares/shares.module';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { FileViewComponent } from './file-view/file-view.component';
import { FileDetailComponent } from './file-detail/file-detail.component';
import { FileTrashComponent } from './file-trash/file-trash.component';
import { FileShareComponent } from './file-share/file-share.component';
import { FileFavoriteComponent } from './file-favorite/file-favorite.component';
import { FileRecentComponent } from './file-recent/file-recent.component';

@NgModule({
  imports: [SharesModule, CoreModule.forChild(), ContentModule.forChild()],
  declarations: [
    FilesComponent,
    FileViewComponent,
    FileDetailComponent,
    FileTrashComponent,
    FileShareComponent,
    FileFavoriteComponent,
    FileRecentComponent
  ]
})
export class FilesModule {}
