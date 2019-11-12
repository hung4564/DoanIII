import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppStore, isQuickShareEnabled } from 'app/store';

@Injectable({
  providedIn: 'root'
})
export class AppSharedRuleGuard implements CanActivate {
  isQuickShareEnabled$: Observable<boolean>;

  constructor(store: Store<AppStore>) {
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
