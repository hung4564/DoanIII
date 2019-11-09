import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PreviewService } from 'app/services/preview.service';
import { NotificationService, RestoreMessageModel, NodeRestoreDirective } from '@alfresco/adf-core';
import { Router } from '@angular/router';
import { PathInfoEntity } from '@alfresco/js-api';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { MatButton } from '@angular/material';

@Component({
  selector: 'app-file-trash',
  templateUrl: './file-trash.component.html',
  styleUrls: ['./file-trash.component.scss'],
  host: { class: 'app-layout' }
})
export class FileTrashComponent implements OnInit {
  @ViewChild('documentList') documentList: DocumentListComponent;
  @ViewChild('btnRestore') btnRestore: MatButton;

  columns: any[] = [];
  constructor(
    private preview: PreviewService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {}
  showPreview(event) {
    const entry = event.value.entry;
    if (entry && entry.isFile) {
      this.preview.showResource(entry.id);
    }
  }
  onRestore(restoreMessage: RestoreMessageModel) {
    this.notificationService
      .openSnackMessageAction(restoreMessage.message, restoreMessage.action)
      .onAction()
      .subscribe(() => this.navigateLocation(restoreMessage.path));
    this.documentList.reload();
  }

  navigateLocation(path: PathInfoEntity) {
    const parent = path.elements[path.elements.length - 1];
    this.router.navigate(['file/', parent.id]);
  }
}
