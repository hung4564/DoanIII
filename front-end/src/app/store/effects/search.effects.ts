import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SearchActionTypes, SearchByTermAction } from '../actions/search.actions';
import { SearchOptionIds } from 'app/model/search-option.model';

@Injectable()
export class SearchEffects {
  constructor(private actions$: Actions, private router: Router) {}

  @Effect({ dispatch: false })
  searchByTerm$ = this.actions$.pipe(
    ofType<SearchByTermAction>(SearchActionTypes.SearchByTerm),
    map(action => {
      const query = action.payload.replace(/[(]/g, '%28').replace(/[)]/g, '%29');

      const libItem = action.searchOptions.find(item => item.id === SearchOptionIds.Libraries);
      const librarySelected = !!libItem && libItem.value;
      if (librarySelected) {
        this.router.navigateByUrl('/search-libraries;q=' + encodeURIComponent(query));
      } else {
        this.router.navigateByUrl('/search;q=' + encodeURIComponent(query));
      }
    })
  );
}
