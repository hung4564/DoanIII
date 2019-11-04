import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { PageComponent } from '../page.component';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { NotificationService } from '@alfresco/adf-core';
import { PreviewService } from 'app/services/preview.service';

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

  @ViewChild('documentList')
  documentList: DocumentListComponent;
  constructor(private notificationService: NotificationService, private preview: PreviewService) {
    super();
  }

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
}
