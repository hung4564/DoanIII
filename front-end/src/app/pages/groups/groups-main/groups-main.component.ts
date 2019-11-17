import { Component, OnInit } from '@angular/core';
import {
  ObjectDataTableAdapter,
  TranslationService,
  ObjectDataRow,
  DataCellEvent,
  DataRowActionEvent,
  PaginationModel,
  AppConfigService,
  UserPreferencesService
} from '@alfresco/adf-core';
import { GroupsService } from '../groups.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '@alfresco/adf-content-services';
import { GroupsDetailComponent } from '../groups-detail/groups-detail.component';
import { GroupViewListComponent } from '../group-view-list/group-view-list.component';
import { PageComponent } from 'app/pages/page.component';
import { GroupPaging } from '@alfresco/js-api';
import { ContentManagementService } from 'app/services/content-management.service';
import { AppStore } from 'app/store/states/app.state';
import { AppExtensionService } from 'app/extensions/app-extension.service';
import { ContentApiService } from 'app/services/content-api.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-groups-main',
  templateUrl: './groups-main.component.html',
  styleUrls: ['./groups-main.component.scss'],
  host: {
    class: 'app-layout'
  }
})
export class GroupsMainComponent extends PageComponent implements OnInit {
  columns: any[] = [];
  list: GroupPaging;
  isLoading = false;
  constructor(
    content: ContentManagementService,
    private userPreferenceService: UserPreferencesService,
    store: Store<AppStore>,
    extensions: AppExtensionService,
    private contentApi: ContentApiService
  ) {
    super(store, extensions, content);
    this.pagination.maxItems = this.userPreferenceService.paginationSize;
    this.getList(this.pagination);
  }
  ngOnInit() {
    super.ngOnInit();
    this.content.reload.subscribe(() => {
      this.getList(this.pagination);
    });
    this.columns = this.extensions.documentListPresets.groups || [];
  }
  onChangePagination(e: PaginationModel) {
    this.getList(e);
  }
  getList(opt) {
    this.isLoading = true;
    this.contentApi.getGroups(opt).subscribe(
      result => {
        this.list = result;
        this.pagination = result.list.pagination;
        this.isLoading = false;
      },
      err => {
        this.list = null;
        this.pagination = null;
        this.isLoading = false;
      }
    );
  }
}
