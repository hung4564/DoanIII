import { PaginationModel, UserPreferencesService } from "@alfresco/adf-core";
import { GroupPaging } from "@alfresco/js-api";
import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppExtensionService } from "app/extensions/app-extension.service";
import { PageComponent } from "app/pages/page.component";
import { ContentManagementService } from "app/services/content-management.service";
import { GetDataGroupAction } from "app/store/actions/group.actions";
import { getEntityPaging } from "app/store/selectors/entity.selector";
import { AppStore } from "app/store/states/app.state";
import { takeUntil } from "rxjs/operators";

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
    extensions: AppExtensionService
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
    this.store
      .select(getEntityPaging)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(result => {
        this.list = result;
        this.isLoading = false;
        this.pagination = (result.list || {}).pagination || {};
      });
  }
  onChangePagination(e: PaginationModel) {
    this.getList(e);
  }
  getList(opt) {
    this.isLoading = true;

    this.store.dispatch(new GetDataGroupAction({ filter: opt }));
  }
}
