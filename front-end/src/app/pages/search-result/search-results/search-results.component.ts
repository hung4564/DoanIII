import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchQueryBuilderService, SearchFilterComponent } from '@alfresco/adf-content-services';
import { ResultSetPaging, Pagination, MinimalNodeEntity } from '@alfresco/js-api';
import { Observable } from 'rxjs';
import { PageComponent } from 'app/pages/page.component';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AppConfigService, TranslationService } from '@alfresco/adf-core';
import { AppStore } from 'app/store/states/app.state';
import { Store } from '@ngrx/store';
import { AppExtensionService } from 'app/extensions/app-extension.service';
import { ContentManagementService } from 'app/services/content-management.service';
import { showFacetFilter } from 'app/store/selectors/app.selector';
import { SnackbarErrorAction } from 'app/store/actions/snackbar.actions';
import { NavigateToFolder } from 'app/store/actions/router.actions';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  host: { class: 'app-layout' }
})
export class SearchResultsComponent extends PageComponent implements OnInit {
  @ViewChild('searchFilter')
  searchFilter: SearchFilterComponent;

  showFacetFilter$: Observable<boolean>;

  searchedWord: string;
  queryParamName = 'q';
  data: ResultSetPaging;
  totalResults = 0;
  hasSelectedFilters = false;
  sorting = ['name', 'asc'];
  isLoading = false;

  constructor(
    private queryBuilder: SearchQueryBuilderService,
    private route: ActivatedRoute,
    private config: AppConfigService,
    store: Store<AppStore>,
    extensions: AppExtensionService,
    content: ContentManagementService,
    private translationService: TranslationService,
    private router: Router
  ) {
    super(store, extensions, content);

    queryBuilder.paging = {
      skipCount: 0,
      maxItems: 25
    };

    this.showFacetFilter$ = store.select(showFacetFilter);
  }

  ngOnInit() {
    super.ngOnInit();

    this.sorting = this.getSorting();

    this.subscriptions.push(
      this.queryBuilder.updated.subscribe(query => {
        if (query) {
          this.sorting = this.getSorting();
          this.isLoading = true;
        }
      }),

      this.queryBuilder.executed.subscribe(data => {
        this.queryBuilder.paging.skipCount = 0;

        this.onSearchResultLoaded(data);
        this.isLoading = false;
      }),

      this.queryBuilder.error.subscribe((err: any) => {
        this.onSearchError(err);
      })
    );

    if (this.route) {
      this.route.params.forEach((params: Params) => {
        this.searchedWord = params.hasOwnProperty(this.queryParamName)
          ? params[this.queryParamName]
          : null;
        const query = this.formatSearchQuery(this.searchedWord);

        if (query) {
          this.queryBuilder.userQuery = decodeURIComponent(query);
          this.queryBuilder.update();
        } else {
          this.queryBuilder.userQuery = null;
          this.queryBuilder.executed.next({
            list: { pagination: { totalItems: 0 }, entries: [] }
          });
        }
      });
    }
  }

  onSearchError(error: { message: any }) {
    const { statusCode } = JSON.parse(error.message).error;

    const messageKey = `APP.BROWSE.SEARCH.ERRORS.${statusCode}`;
    let translated = this.translationService.instant(messageKey);

    if (translated === messageKey) {
      translated = this.translationService.instant(`APP.BROWSE.SEARCH.ERRORS.GENERIC`);
    }

    this.store.dispatch(new SnackbarErrorAction(translated));
  }

  private isOperator(input: string): boolean {
    if (input) {
      input = input.trim().toUpperCase();

      const operators = ['AND', 'OR'];
      return operators.includes(input);
    }
    return false;
  }

  private formatFields(fields: string[], term: string): string {
    let prefix = '';
    let suffix = '*';

    if (term.startsWith('=')) {
      prefix = '=';
      suffix = '';
      term = term.substring(1);
    }

    return '(' + fields.map(field => `${prefix}${field}:"${term}${suffix}"`).join(' OR ') + ')';
  }

  formatSearchQuery(userInput: string) {
    if (!userInput) {
      return null;
    }

    userInput = userInput.trim();

    if (userInput.includes(':') || userInput.includes('"')) {
      return userInput;
    }

    const fields = this.config.get<string[]>('search.aca:fields', ['cm:name']);
    const words = userInput.split(' ');

    if (words.length > 1) {
      const separator = words.some(this.isOperator) ? ' ' : ' AND ';

      return words
        .map(term => {
          if (this.isOperator(term)) {
            return term;
          }

          return this.formatFields(fields, term);
        })
        .join(separator);
    }

    return this.formatFields(fields, userInput);
  }

  onSearchResultLoaded(nodePaging: ResultSetPaging) {
    this.data = nodePaging;
    this.totalResults = this.getNumberOfResults();
    this.hasSelectedFilters = this.isFiltered();
  }

  getNumberOfResults() {
    if (this.data && this.data.list && this.data.list.pagination) {
      return this.data.list.pagination.totalItems;
    }
    return 0;
  }

  isFiltered(): boolean {
    return this.searchFilter.selectedBuckets.length > 0 || this.hasCheckedCategories();
  }

  hasCheckedCategories() {
    const checkedCategory = this.queryBuilder.categories.find(
      category => !!this.queryBuilder.queryFragments[category.id]
    );
    return !!checkedCategory;
  }

  onPaginationChanged(pagination: Pagination) {
    this.queryBuilder.paging = {
      maxItems: pagination.maxItems,
      skipCount: pagination.skipCount
    };
    this.queryBuilder.update();
  }

  private getSorting(): string[] {
    const primary = this.queryBuilder.getPrimarySorting();

    if (primary) {
      return [primary.key, primary.ascending ? 'asc' : 'desc'];
    }

    return ['name', 'asc'];
  }

  onNodeDoubleClick(node: MinimalNodeEntity) {
    if (node && node.entry) {
      if (node.entry.isFolder) {
        this.store.dispatch(new NavigateToFolder(node));
        return;
      }

      this.showPreview(node, { location: this.router.url });
    }
  }

  hideSearchFilter() {
    return !this.totalResults && !this.hasSelectedFilters;
  }
}
