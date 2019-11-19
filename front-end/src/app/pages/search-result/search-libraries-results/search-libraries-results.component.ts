import { NodePaging, Pagination, SiteEntry } from '@alfresco/js-api';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { ContentManagementService } from '../../../services/content-management.service';
import { PageComponent } from '../../page.component';
import { AppStore } from 'app/store/states/app.state';
import { AppExtensionService } from 'app/extensions/app-extension.service';
import { SearchLibrariesQueryBuilderService } from 'app/layout/partials/search-input/search-libraries-query-builder.service';
import { NavigateLibraryAction } from 'app/store/actions/library.actions';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-libraries-results.component.html',
  styleUrls: ['./search-libraries-results.component.scss'],
  host: { class: 'app-layout' }
})
export class SearchLibrariesResultsComponent extends PageComponent implements OnInit {
  isSmallScreen = false;
  searchedWord: string;
  queryParamName = 'q';
  data: NodePaging;
  totalResults = 0;
  isLoading = false;
  columns: any[] = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private librariesQueryBuilder: SearchLibrariesQueryBuilderService,
    private route: ActivatedRoute,
    store: Store<AppStore>,
    extensions: AppExtensionService,
    content: ContentManagementService
  ) {
    super(store, extensions, content);

    librariesQueryBuilder.paging = {
      skipCount: 0,
      maxItems: 25
    };
  }

  ngOnInit() {
    super.ngOnInit();

    this.columns = this.extensions.documentListPresets.searchLibraries || [];

    this.subscriptions.push(
      this.content.libraryJoined.subscribe(() => this.librariesQueryBuilder.update()),
      this.content.libraryLeft.subscribe(() => this.librariesQueryBuilder.update()),

      this.librariesQueryBuilder.updated.subscribe(() => {
        this.isLoading = true;

        this.librariesQueryBuilder.execute();
      }),

      this.librariesQueryBuilder.executed.subscribe(data => {
        this.onSearchResultLoaded(data);
        this.isLoading = false;
      }),

      this.librariesQueryBuilder.hadError.subscribe(err => {
        try {
          const {
            error: { statusCode }
          } = JSON.parse(err.message);
          if (statusCode === 400) {
            this.content.library400Error.next();
          }
        } catch (e) {}
      }),

      this.breakpointObserver
        .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
        .subscribe(result => {
          this.isSmallScreen = result.matches;
        })
    );

    if (this.route) {
      this.route.params.forEach((params: Params) => {
        this.searchedWord = params.hasOwnProperty(this.queryParamName)
          ? params[this.queryParamName]
          : null;
        const query = this.formatSearchQuery(this.searchedWord);

        if (query && query.length > 1) {
          this.librariesQueryBuilder.paging.skipCount = 0;
          this.librariesQueryBuilder.userQuery = query;
          this.librariesQueryBuilder.update();
        } else {
          this.librariesQueryBuilder.userQuery = null;
          this.librariesQueryBuilder.executed.next({
            list: { pagination: { totalItems: 0 }, entries: [] }
          });
        }
      });
    }
  }

  private formatSearchQuery(userInput: string) {
    if (!userInput) {
      return null;
    }
    return userInput.trim();
  }

  onSearchResultLoaded(nodePaging: NodePaging) {
    this.data = nodePaging;
    this.totalResults = this.getNumberOfResults();
  }

  getNumberOfResults() {
    if (this.data && this.data.list && this.data.list.pagination) {
      return this.data.list.pagination.totalItems;
    }
    return 0;
  }

  onPaginationChanged(pagination: Pagination) {
    this.librariesQueryBuilder.paging = {
      maxItems: pagination.maxItems,
      skipCount: pagination.skipCount
    };
    this.librariesQueryBuilder.update();
  }

  navigateTo(node: SiteEntry) {
    if (node && node.entry && node.entry.guid) {
      this.store.dispatch(new NavigateLibraryAction(node.entry.guid));
    }
  }
}
