import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { isQuickShareEnabled } from 'app/store/selectors/app.selector';

@Injectable({
  providedIn: 'root'
})
export class AppSharedRuleGuard implements CanActivate {
  isQuickShareEnabled$: Observable<boolean>;

  constructor(store: Store<any>) {
    this.isQuickShareEnabled$ = store.select(isQuickShareEnabled);
  }

  canActivate(_: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.isQuickShareEnabled$;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route);
  }
}
