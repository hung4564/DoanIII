import { ContentMetadataModule, VersionManagerModule } from '@alfresco/adf-content-services';
import { CoreModule } from '@alfresco/adf-core';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { NgModule } from '@angular/core';
import { CommentsTabComponent } from './comments-tab/comments-tab.component';
import { InfoDrawerComponent } from './info-drawer.component';
import { MetadataTabComponent } from './metadata-tab/metadata-tab.component';
import { LibraryMetadataTabComponent } from './library-metadata-tab/library-metadata-tab.component';
import { LibraryMetadataFormComponent } from './library-metadata-tab/library-metadata-form.component';
import { VersionsTabComponent } from './versions-tab/versions-tab.component';

export function components() {
  return [
    InfoDrawerComponent,
    MetadataTabComponent,
    CommentsTabComponent,
    VersionsTabComponent,
    LibraryMetadataTabComponent,
    LibraryMetadataFormComponent
  ];
}

@NgModule({
  imports: [
    CoreModule.forChild(),
    ExtensionsModule,
    ContentMetadataModule,
    VersionManagerModule
  ],
  declarations: [...components()],
  exports: [...components()],
  entryComponents: [...components()]
})
export class AppInfoDrawerModule {}
