import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LibraryService } from "../library.service";
import { PageComponent } from "app/pages/page.component";
import { AppExtensionService } from "app/extensions/app-extension.service";
import { ContentManagementService } from "app/services/content-management.service";
import { Store } from "@ngrx/store";
import { SiteMemberPaging } from "@alfresco/js-api";
import { UserPreferencesService } from "@alfresco/adf-core";

@Component({
  selector: "app-libraries-member",
  templateUrl: "./libraries-member.component.html",
  styleUrls: ["./libraries-member.component.scss"],
  host: { class: "app-layout" }
})
export class LibrariesMemberComponent extends PageComponent implements OnInit {
  libraryId: string;
  isLoading = false;
  list: SiteMemberPaging;
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
    this.libraryId = this.librarySv.siteId;
    this.pagination.maxItems = this.userPreferenceService.paginationSize;
    this.columns = this.extensions.documentListPresets.siteMembers || [];
    this.getList(this.pagination);
  }
  onChangePagination(e: any) {
    this.getList(e);
  }
  getList(opt) {
    this.isLoading = true;
    this.librarySv.getSiteMember(opt).subscribe(
      result => {
        console.log("TCL: LibrariesMemberComponent -> getList -> result", result);
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
