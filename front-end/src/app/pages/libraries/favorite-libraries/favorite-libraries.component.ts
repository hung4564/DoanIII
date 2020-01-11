import { UserPreferencesService } from "@alfresco/adf-core";
import { Pagination, SiteEntry } from "@alfresco/js-api";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppExtensionService } from "app/extensions/app-extension.service";
import { ContentManagementService } from "app/services/content-management.service";
import {
  GetDataFavoriteLibraryAction,
  NavigateLibraryAction
} from "app/store/actions/library.actions";
import { getEntityPaging } from "app/store/selectors/entity.selector";
import { takeUntil } from "rxjs/operators";
import { PageComponent } from "../../page.component";
@Component({
  templateUrl: "./favorite-libraries.component.html",
  host: { class: "app-layout" }
})
export class FavoriteLibrariesComponent extends PageComponent
  implements OnInit {
  pagination: Pagination;
  isLoading = false;
  list: any;
  isSmallScreen = false;
  columns: any[] = [];

  constructor(
    content: ContentManagementService,
    store: Store<any>,
    extensions: AppExtensionService,
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
    this.store
      .select(getEntityPaging)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(result => {
        this.list = result;
        this.isLoading = false;
        this.pagination = (result.list || {}).pagination || {};
      });
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

    this.store.dispatch(
      new GetDataFavoriteLibraryAction({ filter: pagination })
    );
  }

  private reloadList() {
    this.reload();
    this.getList(this.pagination);
  }
}
