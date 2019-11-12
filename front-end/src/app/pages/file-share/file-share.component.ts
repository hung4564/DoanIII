import { Component, OnInit } from '@angular/core';
import { PageComponent } from '../page.component';
import { Store } from '@ngrx/store';
import { AppExtensionService } from 'app/extensions/app-extension.service';
import { ContentManagementService } from 'app/services/content-management.service';
import { UploadService } from '@alfresco/adf-core';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-file-share',
  templateUrl: './file-share.component.html',
  styleUrls: ['./file-share.component.scss'],
  host: { class: 'app-layout' }
})
export class FileShareComponent extends PageComponent implements OnInit {
  columns: any[] = [];
  constructor(
    store: Store<any>,
    extensions: AppExtensionService,
    content: ContentManagementService,
    private uploadService: UploadService
  ) {
    super(store, extensions, content);
  }

  ngOnInit() {
    super.ngOnInit();

    this.subscriptions = this.subscriptions.concat([
      this.content.linksUnshared.pipe(debounceTime(300)).subscribe(() => this.reload()),

      this.uploadService.fileUploadComplete.pipe(debounceTime(300)).subscribe(_ => this.reload()),
      this.uploadService.fileUploadDeleted.pipe(debounceTime(300)).subscribe(_ => this.reload())
    ]);

    this.columns = this.extensions.documentListPresets.shared || [];
  }
}
