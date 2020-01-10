import { AuthenticationService } from "@alfresco/adf-core";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { ContentManagementService } from "app/services/content-management.service";
import { map } from "rxjs/operators";
import {
  AppActionTypes,
  LogoutAction,
  ReloadDocumentListAction,
  ResetSelectionAction
} from "../actions/app.actions";
import { SetSelectedNodesAction } from "../actions/node.actions";

@Injectable()
export class AppEffects {
  constructor(
    private store: Store<any>,
    private actions$: Actions,
    private auth: AuthenticationService,
    private router: Router,
    private content: ContentManagementService
  ) {}
  @Effect({ dispatch: false })
  resetSelection = this.actions$.pipe(
    ofType<ResetSelectionAction>(AppActionTypes.ResetSelection),
    map(action => {
      this.content.reset.next(action);
    })
  );
  @Effect({ dispatch: false })
  reload = this.actions$.pipe(
    ofType<ReloadDocumentListAction>(AppActionTypes.ReloadDocumentList),
    map(action => {
      this.store.dispatch(new SetSelectedNodesAction([]));
      this.content.reload.next(action);
    })
  );

  @Effect({ dispatch: false })
  logout$ = this.actions$.pipe(
    ofType<LogoutAction>(AppActionTypes.Logout),
    map(() => {
      this.auth.logout().subscribe(
        () => this.redirectToLogin(),
        () => this.redirectToLogin()
      );
    })
  );

  private redirectToLogin() {
    this.router.navigate(["login"]);
  }
}
