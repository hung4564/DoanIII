import { PaginationModel, UserPreferencesService } from "@alfresco/adf-core";
import { PersonPaging } from "@alfresco/js-api";
import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppExtensionService } from "app/extensions/app-extension.service";
import { ContentManagementService } from "app/services/content-management.service";
import { GetDataPersonAction } from "app/store/actions/person.actions";
import { getEntityPaging } from "app/store/selectors/entity.selector";
import { AppStore } from "app/store/states/app.state";
import { takeUntil } from "rxjs/operators";
import { PageComponent } from "../page.component";

@Component({
  selector: "app-people",
  templateUrl: "./people.component.html",
  styleUrls: ["./people.component.scss"],
  host: {
    class: "app-layout"
  }
})
export class PeopleComponent extends PageComponent implements OnInit {
  columns: any[] = [];
  list: PersonPaging;
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
    this.columns = this.extensions.documentListPresets.people || [];

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
    this.store.dispatch(new GetDataPersonAction({ filter: opt }));
  }
}
