import { Component, OnInit } from '@angular/core';
import { PageComponent } from '../page.component';
import { ContentManagementService } from 'app/services/content-management.service';
import { AppExtensionService } from 'app/extensions/app-extension.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ProfileState } from '@alfresco/adf-extensions';
import { getUserProfile } from 'app/store/selectors/app.selector';

@Component({
  selector: 'app-file-trash',
  templateUrl: './file-trash.component.html',
  styleUrls: ['./file-trash.component.scss'],
  host: { class: 'app-layout' }
})
export class FileTrashComponent extends PageComponent implements OnInit {
  user$: Observable<ProfileState>;

  columns: any[] = [];
  constructor(
    content: ContentManagementService,
    extensions: AppExtensionService,
    store: Store<any>
  ) {
    super(store, extensions, content);
    this.user$ = this.store.select(getUserProfile);
  }

  ngOnInit() {
    super.ngOnInit();
    this.columns = this.extensions.documentListPresets.trashcan || [];
  }
}
