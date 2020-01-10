import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { SearchOptionIds } from "app/model/search-option.model";
import { map } from "rxjs/operators";
import {
  SearchActionTypes,
  SearchByTermAction
} from "../actions/search.actions";

@Injectable()
export class SearchEffects {
  constructor(private actions$: Actions, private router: Router) {}

  @Effect({ dispatch: false })
  searchByTerm$ = this.actions$.pipe(
    ofType<SearchByTermAction>(SearchActionTypes.SearchByTerm),
    map(action => {
      const query = action.payload
        .replace(/[(]/g, "%28")
        .replace(/[)]/g, "%29");

      const libItem = action.searchOptions.find(
        item => item.id === SearchOptionIds.Libraries
      );
      const librarySelected = !!libItem && libItem.value;
      if (librarySelected) {
        this.router.navigateByUrl(
          "/search/libraries;q=" + encodeURIComponent(query)
        );
      } else {
        this.router.navigateByUrl("/search;q=" + encodeURIComponent(query));
      }
    })
  );
}
