import { Injectable, Inject } from '@angular/core';
import { AuthenticationService, AppConfigService } from '@alfresco/adf-core';
import { Observable, BehaviorSubject } from 'rxjs';
import { RouteReuseStrategy } from '@angular/router';
import { AppRouteReuseStrategy } from '../routing/app.routes.strategy';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private ready: BehaviorSubject<boolean>;
  ready$: Observable<boolean>;

  /**
   * Whether `withCredentials` mode is enabled.
   * Usually means that `Kerberos` mode is used.
   */
  get withCredentials(): boolean {
    return this.config.get<boolean>('auth.withCredentials', false);
  }

  constructor(
    auth: AuthenticationService,
    private config: AppConfigService,
    @Inject(RouteReuseStrategy) routeStrategy: AppRouteReuseStrategy
  ) {
    this.ready = new BehaviorSubject(auth.isLoggedIn() || this.withCredentials);
    this.ready$ = this.ready.asObservable();

    auth.onLogin.subscribe(() => {
      routeStrategy.resetCache();
      this.ready.next(true);
    });

    auth.onLogout.subscribe(() => {
      routeStrategy.resetCache();
    });
  }
}
