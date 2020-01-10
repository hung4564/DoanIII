import { PaginationModel, UserPreferencesService } from "@alfresco/adf-core";
import { GroupPaging } from "@alfresco/js-api";
import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppExtensionService } from "app/extensions/app-extension.service";
import { PageComponent } from "app/pages/page.component";
import { ContentApiService } from "app/services/content-api.service";
import { ContentManagementService } from "app/services/content-management.service";
import { AppStore } from "app/store/states/app.state";

@Component({
  selector: "app-groups-main",
  templateUrl: "./groups-main.component.html",
  styleUrls: ["./groups-main.component.scss"],
  host: {
    class: "app-layout"
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
