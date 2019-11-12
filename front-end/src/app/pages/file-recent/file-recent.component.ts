import { Component, OnInit } from '@angular/core';
import { PageComponent } from '../page.component';
import { Store } from '@ngrx/store';
import { AppExtensionService } from 'app/extensions/app-extension.service';
import { ContentManagementService } from 'app/services/content-management.service';
import { MinimalNodeEntity } from '@alfresco/js-api';

@Component({
  selector: 'app-file-recent',
  templateUrl: './file-recent.component.html',
  styleUrls: ['./file-recent.component.scss'],
  host: { class: 'app-layout' }
})
export class FileRecentComponent extends PageComponent implements OnInit {
  columns: any[] = [];
  constructor(
    store: Store<any>,
    extensions: AppExtensionService,
    content: ContentManagementService
  ) {
    super(store, extensions, content);
  }

  ngOnInit() {
    super.ngOnInit();

    this.columns = this.extensions.documentListPresets.recent || [];
  }
  onNodeDoubleClick(node: MinimalNodeEntity) {
    if (node && node.entry) {
      this.showPreview(node);
    }
  }
}
