import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, take } from 'rxjs/operators';
import { ContentManagementService } from '../../services/content-management.service';
import { AppStore } from '../states/app.state';
import { DeleteLibraryAction, LibraryActionTypes, LeaveLibraryAction, CreateLibraryAction, NavigateLibraryAction, UpdateLibraryAction } from '../actions/library.actions';
import { getAppSelection } from '../selectors/app.selector';
import { NavigateRouteAction } from '../actions/router.actions';
import { SnackbarErrorAction } from '../actions/snackbar.actions';
import { ContentApiService } from 'app/services/content-api.service';

@Injectable()
export class LibraryEffects {
  constructor(
    private store: Store<AppStore>,
    private actions$: Actions,
    private content: ContentManagementService,
    private contentApi: ContentApiService
  ) {}

  @Effect({ dispatch: false })
  deleteLibrary$ = this.actions$.pipe(
    ofType<DeleteLibraryAction>(LibraryActionTypes.Delete),
    map(action => {
      if (action.payload) {
        this.content.deleteLibrary(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && selection.library) {
              this.content.deleteLibrary(selection.library.entry.id);
            }
          });
      }
    })
  );

  @Effect({ dispatch: false })
  leaveLibrary$ = this.actions$.pipe(
    ofType<LeaveLibraryAction>(LibraryActionTypes.Leave),
    map(action => {
      if (action.payload) {
        this.content.leaveLibrary(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && selection.library) {
              this.content.leaveLibrary(selection.library.entry.id);
            }
          });
      }
    })
  );

  @Effect()
  createLibrary$ = this.actions$.pipe(
    ofType<CreateLibraryAction>(LibraryActionTypes.Create),
    mergeMap(() => this.content.createLibrary()),
    map(libraryId => new NavigateLibraryAction(libraryId))
  );

  @Effect({ dispatch: false })
  navigateLibrary$ = this.actions$.pipe(
    ofType<NavigateLibraryAction>(LibraryActionTypes.Navigate),
    map(action => {
      const libraryId = action.payload;
      if (libraryId) {
        this.contentApi
          .getNode(libraryId, { relativePath: '/documentLibrary' })
          .pipe(map(node => node.entry.id))
          .subscribe(
            id => {
              this.store.dispatch(new NavigateRouteAction(['libraries', id]));
            },
            () => {
              this.store.dispatch(
                new SnackbarErrorAction('APP.MESSAGES.ERRORS.MISSING_CONTENT')
              );
            }
          );
      }
    })
  );

  @Effect({ dispatch: false })
  updateLibrary$ = this.actions$.pipe(
    ofType<UpdateLibraryAction>(LibraryActionTypes.Update),
    map(action => {
      this.store
        .select(getAppSelection)
        .pipe(take(1))
        .subscribe(selection => {
          if (selection && selection.library) {
            const { id } = selection.library.entry;
            const { title, description, visibility } = action.payload;

            const siteBody = {
              title,
              description,
              visibility
            };

            this.content.updateLibrary(id, siteBody);
          }
        });
    })
  );
}
