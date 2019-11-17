import { Action } from '@ngrx/store';
import { SearchOptionModel } from 'app/model/search-option.model';

export enum SearchActionTypes {
  SearchByTerm = 'SEARCH_BY_TERM',
  ToggleFilter = 'TOGGLE_SEARCH_FILTER',
  ShowFilter = 'SHOW_SEARCH_FILTER',
  HideFilter = 'HIDE_SEARCH_FILTER'
}

export class SearchByTermAction implements Action {
  readonly type = SearchActionTypes.SearchByTerm;
  constructor(public payload: string, public searchOptions?: SearchOptionModel[]) {}
}

export class ToggleSearchFilterAction implements Action {
  readonly type = SearchActionTypes.ToggleFilter;
}

export class ShowSearchFilterAction implements Action {
  readonly type = SearchActionTypes.ShowFilter;
}

export class HideSearchFilterAction implements Action {
  readonly type = SearchActionTypes.HideFilter;
}
