import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable } from "rxjs";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { isAdmin } from "app/store/selectors/app.selector";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AppAdminRuleGuard implements CanActivate {
  isAdmin$: Observable<boolean>;

  constructor(store: Store<any>, private router: Router) {
    this.isAdmin$ = store.select(isAdmin);
  }

  canActivate(
    _: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.isAdmin$.pipe(
      map(x => {
        if (!x) {
          this.router.navigateByUrl("");
        }
        return x;
      })
    );
  }

  canActivateChild(
    route: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route);
  }
}
