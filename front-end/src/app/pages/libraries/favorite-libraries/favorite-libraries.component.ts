import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { SiteEntry, FavoritePaging, Pagination } from "@alfresco/js-api";
import { PageComponent } from "../../page.component";
import { UserPreferencesService } from "@alfresco/adf-core";
import { ContentManagementService } from "app/services/content-management.service";
import { AppExtensionService } from "app/extensions/app-extension.service";
import { ContentApiService } from "app/services/content-api.service";
import { NavigateLibraryAction } from "app/store/actions/library.actions";
@Component({
  templateUrl: "./favorite-libraries.component.html",
  host: { class: "app-layout" }
})
export class FavoriteLibrariesComponent extends PageComponent implements OnInit {
  pagination: Pagination;
  isLoading = false;
  list: FavoritePaging;
  isSmallScreen = false;
  columns: any[] = [];

  constructor(
    content: ContentManagementService,
    store: Store<any>,
    extensions: AppExtensionService,
    private contentApi: ContentApiService,
    private breakpointObserver: BreakpointObserver,
    private preferences: UserPreferencesService
  ) {
    super(store, extensions, content);
  }

  ngOnInit() {
    super.ngOnInit();

    this.getList({ maxItems: this.preferences.paginationSize });

    this.subscriptions = this.subscriptions.concat([
      this.content.libraryJoined.subscribe(() => this.reloadList()),
      this.content.libraryLeft.subscribe(() => this.reloadList()),
      this.content.favoriteLibraryToggle.subscribe(() => this.reloadList()),

      this.breakpointObserver
        .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
        .subscribe(result => {
          this.isSmallScreen = result.matches;
        })
    ]);
    this.columns = this.extensions.documentListPresets.favoriteLibraries || [];
  }

  navigateTo(node: SiteEntry) {
    if (node && node.entry && node.entry.guid) {
      this.store.dispatch(new NavigateLibraryAction(node));
    }
  }
  onChange(pagination: Pagination) {
    this.getList(pagination);
  }

  private getList(pagination: Pagination) {
    this.isLoading = true;
    this.contentApi.getFavoriteLibraries("-me-", pagination).subscribe(
      (favoriteLibraries: FavoritePaging) => {
        this.list = favoriteLibraries;
        this.pagination = favoriteLibraries.list.pagination;
        this.isLoading = false;
      },
      () => {
        this.list = null;
        this.pagination = null;
        this.isLoading = false;
      }
    );
  }

  private reloadList() {
    this.reload();
    this.getList(this.pagination);
  }
}
