import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '@alfresco/adf-core';
import { Router } from '@angular/router';
import { ContentManagementService } from 'app/services/content-management.service';
import { AppActionTypes, ReloadDocumentListAction, LogoutAction } from '../actions/app.action';

@Injectable()
export class AppEffects {
  constructor(
    private actions$: Actions,
    private auth: AuthenticationService,
    private router: Router,
    private content: ContentManagementService
  ) {}

  @Effect({ dispatch: false })
  reload = this.actions$.pipe(
    ofType<ReloadDocumentListAction>(AppActionTypes.ReloadDocumentList),
    map(action => {
      this.content.reload.next(action);
    })
  );

  @Effect({ dispatch: false })
  logout$ = this.actions$.pipe(
    ofType<LogoutAction>(AppActionTypes.Logout),
    map(() => {
      this.auth.logout().subscribe(() => this.redirectToLogin(), () => this.redirectToLogin());
    })
  );

  private redirectToLogin() {
    this.router.navigate(['login']);
  }
}
