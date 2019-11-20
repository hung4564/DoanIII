import { Component, OnInit } from "@angular/core";
import { PageComponent } from "../page.component";
import { ContentManagementService } from "app/services/content-management.service";
import { AppStore } from "app/store/states/app.state";
import { Store } from "@ngrx/store";
import { AppExtensionService } from "app/extensions/app-extension.service";
import { PaginationModel, UserPreferencesService } from "@alfresco/adf-core";
import { ContentApiService } from "app/services/content-api.service";
import { PersonPaging } from "@alfresco/js-api";

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
    this.columns = this.extensions.documentListPresets.people || [];
  }
  onChangePagination(e: PaginationModel) {
    this.getList(e);
  }
  getList(opt) {
    this.isLoading = true;
    this.contentApi.getPeople(opt).subscribe(
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
