import { Component, OnInit } from "@angular/core";
import { PageComponent } from "app/pages/page.component";
import { SiteMembershipRequestWithPersonPaging } from "@alfresco/js-api";
import { ActivatedRoute } from "@angular/router";
import { ContentManagementService } from "app/services/content-management.service";
import { UserPreferencesService } from "@alfresco/adf-core";
import { Store } from "@ngrx/store";
import { LibraryService } from "../library.service";
import { AppExtensionService } from "app/extensions/app-extension.service";

@Component({
  selector: "app-libraies-pending",
  templateUrl: "./libraies-pending.component.html",
  styleUrls: ["./libraies-pending.component.scss"],
  host: { class: "app-layout" }
})
export class LibraiesPendingComponent extends PageComponent implements OnInit {
  libraryId: string;
  isLoading = false;
  list: SiteMembershipRequestWithPersonPaging;
  columns: any[] = [];
  constructor(
    private route: ActivatedRoute,
    content: ContentManagementService,
    private userPreferenceService: UserPreferencesService,
    store: Store<any>,
    extensions: AppExtensionService,
    private librarySv: LibraryService
  ) {
    super(store, extensions, content);
  }
  fullName(test) {
    return test.firstName;
  }
  ngOnInit() {
    this.content.reload.subscribe(() => this.getList(this.pagination));
    this.libraryId = this.librarySv.siteId;
    this.pagination.maxItems = this.userPreferenceService.paginationSize;
    this.columns = this.extensions.documentListPresets.siteMembersRequest || [];
    this.getList(this.pagination);
  }
  onChangePagination(e: any) {
    this.getList(e);
  }
  getList(opt) {
    this.isLoading = true;
    this.librarySv.getSiteMemberRequest(opt).subscribe(
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
  getDataForColumn(context, column) {
    return { ...context, action: column.actions };
  }
}
