import { Component, Input } from '@angular/core';
import { SiteEntry } from '@alfresco/js-api';

@Component({
  selector: 'app-metadata-tab',
  template:
    '<app-library-metadata-form [node]="node"></app-library-metadata-form>',
  host: { class: 'app-metadata-tab' }
})
export class LibraryMetadataTabComponent {
  @Input()
  node: SiteEntry;
}
