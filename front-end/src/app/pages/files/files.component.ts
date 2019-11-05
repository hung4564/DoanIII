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

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
  host: { class: 'app-layout' }
})
export class FilesComponent implements OnInit {
  @Input()
  showViewer = false;
  nodeId: string = null;

  @ViewChild('documentList') documentList: DocumentListComponent;
  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private preview: PreviewService
  ) {}

  ngOnInit() {}

  uploadSuccess(event: any) {
    this.notificationService.openSnackMessage('File uploaded');
    this.documentList.reload();
  }

  showPreview(event) {
    const entry = event.value.entry;
    if (entry && entry.isFile) {
      this.preview.showResource(entry.id);
    }
  }

  onGoBack(event: any) {
    this.showViewer = false;
    this.nodeId = null;
  }
  editFile(e) {
    if (e && e.value) {
      const node = e.value.entry;
      this.router.navigate([`file/${node.id}`]);
    }
  }
  onContentActionError($event) {}
  onContentActionSuccess($event) {
    this.documentList.reload();
  }
  onPermissionsFailed($event) {}
  myCustomActionAfterDelete(event) {
    const entry = event.value.entry;

    let item = '';

    if (entry.isFile) {
      item = 'file';
    } else if (entry.isFolder) {
      item = 'folder';
    }

    this.notificationService.openSnackMessage(`Deleted ${item} "${entry.name}" `, 20000);
  }
}
