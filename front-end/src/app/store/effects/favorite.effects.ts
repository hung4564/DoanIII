import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { ContentManagementService } from '../../services/content-management.service';
import { AppStore } from '../states/app.state';
import { AddFavoriteAction, NodeActionTypes, RemoveFavoriteAction } from '../actions/node.actions';
import { getAppSelection } from '../selectors/app.selector';

@Injectable()
export class FavoriteEffects {
  constructor(
    private store: Store<AppStore>,
    private actions$: Actions,
    private content: ContentManagementService
  ) {}

  @Effect({ dispatch: false })
  addFavorite$ = this.actions$.pipe(
    ofType<AddFavoriteAction>(NodeActionTypes.AddFavorite),
    map(action => {
      if (action.payload && action.payload.length > 0) {
        this.content.addFavorite(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && !selection.isEmpty) {
              this.content.addFavorite(selection.nodes);
            }
          });
      }
    })
  );

  @Effect({ dispatch: false })
  removeFavorite$ = this.actions$.pipe(
    ofType<RemoveFavoriteAction>(NodeActionTypes.RemoveFavorite),
    map(action => {
      if (action.payload && action.payload.length > 0) {
        this.content.removeFavorite(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && !selection.isEmpty) {
              this.content.removeFavorite(selection.nodes);
            }
          });
      }
    })
  );
}
