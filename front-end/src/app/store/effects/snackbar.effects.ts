import { TranslationService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { SnackbarInfoAction, SnackbarActionTypes, SnackbarWarningAction, SnackbarErrorAction, SnackbarAction } from '../actions/snackbar.actions';

@Injectable()
export class SnackbarEffects {
  constructor(
    private store: Store<any>,
    private actions$: Actions,
    private snackBar: MatSnackBar,
    private translationService: TranslationService
  ) {}

  @Effect({ dispatch: false })
  infoEffect = this.actions$.pipe(
    ofType<SnackbarInfoAction>(SnackbarActionTypes.Info),
    map((action: SnackbarInfoAction) => {
      this.showSnackBar(action, 'info-snackbar');
    })
  );

  @Effect({ dispatch: false })
  warningEffect = this.actions$.pipe(
    ofType<SnackbarWarningAction>(SnackbarActionTypes.Warning),
    map((action: SnackbarWarningAction) => {
      this.showSnackBar(action, 'warning-snackbar');
    })
  );

  @Effect({ dispatch: false })
  errorEffect = this.actions$.pipe(
    ofType<SnackbarErrorAction>(SnackbarActionTypes.Error),
    map((action: SnackbarErrorAction) => {
      this.showSnackBar(action, 'error-snackbar');
    })
  );

  private showSnackBar(action: SnackbarAction, panelClass: string) {
    const message = this.translate(action.payload, action.params);

    let actionName: string = null;
    if (action.userAction) {
      actionName = this.translate(action.userAction.title);
    }

    const snackBarRef = this.snackBar.open(message, actionName, {
      duration: action.duration || 4000,
      panelClass: panelClass
    });

    if (action.userAction) {
      snackBarRef.onAction().subscribe(() => {
        this.store.dispatch(action.userAction.action);
      });
    }
  }

  private translate(message: string, params?: Object): string {
    return this.translationService.instant(message, params);
  }
}
