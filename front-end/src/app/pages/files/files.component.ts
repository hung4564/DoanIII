import { Component, OnInit, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import {
  NotificationService,
  TranslationService,
  DataCellEvent,
  DataRowActionEvent
} from '@alfresco/adf-core';
import { PreviewService } from 'app/services/preview.service';
import { Router } from '@angular/router';
import { PageComponent } from '../page.component';
import { AppExtensionService } from 'app/extensions/app-extension.service';
import { AppStore } from 'app/store';
import { Store } from '@ngrx/store';
import { MinimalNodeEntity } from '@alfresco/js-api';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
  host: { class: 'app-layout' }
})
export class FilesComponent extends PageComponent implements OnInit {
  @Input()
  showViewer = false;
  nodeId: string = null;

  columns: any[] = [];
  @ViewChild('documentList') documentList: DocumentListComponent;
  constructor(
    protected store: Store<AppStore>,
    protected extensions: AppExtensionService,
    private router: Router,
    private notificationService: NotificationService,
    private preview: PreviewService
  ) {
    super(store, extensions);
  }

  ngOnInit() {
    super.ngOnInit();
    this.columns = this.extensions.documentListPresets.files;
  }
  uploadSuccess() {
    this.documentList.reload();
  }
  goDetail(e: MinimalNodeEntity) {
    if (e && e.entry) {
      if (e.entry.isFolder) {
      }

      if (e.entry.isFile) {
        const node = e.entry;
        this.router.navigate([`file/${node.id}`]);
      }
    }
  }
  onNodeDoubleClick(node: MinimalNodeEntity) {
    if (node && node.entry) {
      if (node.entry.isFolder) {
        // this.navigate(node.entry);
      }

      if (node.entry.isFile) {
        this.showPreview(node);
      }
    }
  }
}
