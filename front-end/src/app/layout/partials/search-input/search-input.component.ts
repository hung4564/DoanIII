import { SearchQueryBuilderService } from "@alfresco/adf-content-services";
import { AppConfigService } from "@alfresco/adf-core";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatMenuTrigger } from "@angular/material";
import {
  NavigationEnd,
  PRIMARY_OUTLET,
  Router,
  RouterEvent,
  UrlSegment,
  UrlSegmentGroup,
  UrlTree
} from "@angular/router";
import { Store } from "@ngrx/store";
import {
  SearchOptionIds,
  SearchOptionModel
} from "app/model/search-option.model";
import { ContentManagementService } from "app/services/content-management.service";
import { SearchByTermAction } from "app/store/actions/search.actions";
import { AppStore } from "app/store/states/app.state";
import { Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { SearchInputControlComponent } from "./search-input-control/search-input-control.component";
import { SearchLibrariesQueryBuilderService } from "./search-libraries-query-builder.service";

@Component({
  selector: "app-search-input",
  templateUrl: "./search-input.component.html",
  styleUrls: ["./search-input.component.scss"],
  host: { class: "app-search-input" }
})
export class SearchInputComponent implements OnInit, OnDestroy {
  onDestroy$: Subject<boolean> = new Subject<boolean>();
  hasOneChange = false;
  hasNewChange = false;
  navigationTimer: any;
  has400LibraryError = false;
  searchOnChange: boolean;

  searchedWord: string = null;
  searchOptions: Array<SearchOptionModel> = [
    {
      id: SearchOptionIds.Files,
      key: "SEARCH.INPUT.FILES",
      value: false,
      shouldDisable: this.isLibrariesChecked.bind(this)
    },
    {
      id: SearchOptionIds.Folders,
      key: "SEARCH.INPUT.FOLDERS",
      value: false,
      shouldDisable: this.isLibrariesChecked.bind(this)
    },
    {
      id: SearchOptionIds.Libraries,
      key: "SEARCH.INPUT.LIBRARIES",
      value: false,
      shouldDisable: this.isContentChecked.bind(this)
    }
  ];
  @ViewChild("searchInputControl")
  searchInputControl: SearchInputControlComponent;

  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger;
  constructor(
    private queryBuilder: SearchQueryBuilderService,
    private queryLibrariesBuilder: SearchLibrariesQueryBuilderService,
    private config: AppConfigService,
    private content: ContentManagementService,
    private router: Router,
    private store: Store<AppStore>
  ) {
    this.searchOnChange = this.config.get<boolean>(
      "search.app:triggeredOnChange",
      true
    );
  }

  ngOnInit() {
    this.showInputValue();

    this.router.events
      .pipe(takeUntil(this.onDestroy$))
      .pipe(filter(e => e instanceof RouterEvent))
      .subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.showInputValue();
        }
      });

    this.content.library400Error
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.has400LibraryError = true;
      });
  }
  showInputValue() {
    this.has400LibraryError = false;
    this.searchedWord = this.getUrlSearchTerm();

    if (this.searchInputControl) {
      this.searchInputControl.searchTerm = this.searchedWord;
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
    this.removeContentFilters();
  }

  onMenuOpened() {
    this.searchInputControl.searchInput.nativeElement.focus();
  }

  /**
   * Called when the user submits the search, e.g. hits enter or clicks submit
   *
   * @param event Parameters relating to the search
   */
  onSearchSubmit(event: any) {
    const searchTerm = event.target
      ? (event.target as HTMLInputElement).value
      : event;
    if (searchTerm) {
      this.searchedWord = searchTerm;

      this.searchByOption();
    }
    this.trigger.closeMenu();
  }

  onSearchChange(searchTerm: string) {
    if (!this.searchOnChange) {
      return;
    }

    this.has400LibraryError = false;
    this.searchedWord = searchTerm;

    if (this.hasOneChange) {
      this.hasNewChange = true;
    } else {
      this.hasOneChange = true;
    }

    if (this.hasNewChange) {
      clearTimeout(this.navigationTimer);
      this.hasNewChange = false;
    }

    this.navigationTimer = setTimeout(() => {
      if (searchTerm) {
        this.store.dispatch(
          new SearchByTermAction(searchTerm, this.searchOptions)
        );
      }
      this.hasOneChange = false;
    }, 1000);
  }

  searchByOption() {
    this.syncInputValues();
    this.has400LibraryError = false;
    if (this.isLibrariesChecked()) {
      if (this.onLibrariesSearchResults && this.isSameSearchTerm()) {
        this.queryLibrariesBuilder.update();
      } else if (this.searchedWord) {
        this.store.dispatch(
          new SearchByTermAction(this.searchedWord, this.searchOptions)
        );
      }
    } else {
      if (this.isFoldersChecked() && !this.isFilesChecked()) {
        this.filterContent(SearchOptionIds.Folders);
      } else if (this.isFilesChecked() && !this.isFoldersChecked()) {
        this.filterContent(SearchOptionIds.Files);
      } else {
        this.removeContentFilters();
      }

      if (this.onSearchResults && this.isSameSearchTerm()) {
        this.queryBuilder.update();
      } else if (this.searchedWord) {
        this.store.dispatch(
          new SearchByTermAction(this.searchedWord, this.searchOptions)
        );
      }
    }
  }

  get onLibrariesSearchResults() {
    return this.router.url.indexOf("/search/libraries") === 0;
  }

  get onSearchResults() {
    return (
      !this.onLibrariesSearchResults && this.router.url.indexOf("/search") === 0
    );
  }

  isFilesChecked(): boolean {
    return this.isOptionChecked(SearchOptionIds.Files);
  }

  isFoldersChecked(): boolean {
    return this.isOptionChecked(SearchOptionIds.Folders);
  }

  isLibrariesChecked(): boolean {
    return this.isOptionChecked(SearchOptionIds.Libraries);
  }

  isOptionChecked(optionId: string): boolean {
    const libItem = this.searchOptions.find(item => item.id === optionId);
    return !!libItem && libItem.value;
  }

  isContentChecked(): boolean {
    return this.isFilesChecked() || this.isFoldersChecked();
  }

  hasLibraryConstraint(): boolean {
    if (this.isLibrariesChecked()) {
      return (
        this.has400LibraryError || this.searchInputControl.isTermTooShort()
      );
    }
    return false;
  }

  filterContent(option: SearchOptionIds.Folders | SearchOptionIds.Files) {
    const oppositeOption =
      option === SearchOptionIds.Folders
        ? SearchOptionIds.Files
        : SearchOptionIds.Folders;

    this.queryBuilder.addFilterQuery(`+TYPE:'cm:${option}'`);
    this.queryBuilder.removeFilterQuery(`+TYPE:'cm:${oppositeOption}'`);
  }

  removeContentFilters() {
    this.queryBuilder.removeFilterQuery(`+TYPE:'cm:${SearchOptionIds.Files}'`);
    this.queryBuilder.removeFilterQuery(
      `+TYPE:'cm:${SearchOptionIds.Folders}'`
    );
  }

  syncInputValues() {
    if (this.searchInputControl.searchTerm !== this.searchedWord) {
      if (this.searchInputControl.searchTerm) {
        this.searchedWord = this.searchInputControl.searchTerm;
      } else {
        this.searchInputControl.searchTerm = this.searchedWord;
      }
    }
  }

  getUrlSearchTerm(): string {
    let searchTerm = "";
    if (this.onSearchResults || this.onLibrariesSearchResults) {
      const urlTree: UrlTree = this.router.parseUrl(this.router.url);
      const urlSegmentGroup: UrlSegmentGroup =
        urlTree.root.children[PRIMARY_OUTLET];

      if (urlSegmentGroup) {
        const urlSegments: UrlSegment[] = urlSegmentGroup.segments;
        searchTerm = urlSegments[0].parameters["q"]
          ? decodeURIComponent(urlSegments[0].parameters["q"])
          : "";
      }
    }

    return searchTerm;
  }

  isSameSearchTerm(): boolean {
    const urlSearchTerm = this.getUrlSearchTerm();
    return this.searchedWord === urlSearchTerm;
  }
}
