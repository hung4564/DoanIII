import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  PeopleContentService,
  AppConfigService,
  AuthenticationService,
  AlfrescoApiService,
  SidenavLayoutComponent,
  UserPreferencesService
} from '@alfresco/adf-core';
import { AppStore, AppState } from 'app/store/states/app.state';
import { Store } from '@ngrx/store';
import { GroupsApi, Group } from '@alfresco/js-api';
import { takeUntil, map, filter, withLatestFrom } from 'rxjs/operators';
import { INITIAL_APP_STATE } from 'app/store/states/initial-state';
import { SetUserProfileAction, SetInitialStateAction } from 'app/store/actions/app.action';
import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { AppService } from 'app/services/app.service';
import { Subject, Observable } from 'rxjs';
import { Directionality } from '@angular/cdk/bidi';
import { BreakpointObserver } from '@angular/cdk/layout';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  host: {
    class: 'full-height'
  }
})
export class AdminComponent implements OnInit, OnDestroy {
  @ViewChild('layout')
  layout: SidenavLayoutComponent;

  onDestroy$: Subject<boolean> = new Subject<boolean>();
  isSmallScreen$: Observable<boolean>;

  expandedSidenav: boolean;
  minimizeSidenav = false;
  hideSidenav = false;
  direction: Directionality;

  private minimizeConditions: string[] = ['search'];
  private hideConditions: string[] = ['preview'];

  constructor(
    private alfrescoApiService: AlfrescoApiService,
    private authenticationService: AuthenticationService,
    private store: Store<AppStore>,
    private contentApi: PeopleContentService,
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private appConfigService: AppConfigService,
    private breakpointObserver: BreakpointObserver,
    private userPreferenceService: UserPreferencesService
  ) {}

  ngOnInit() {
    this.isSmallScreen$ = this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .pipe(map(result => result.matches));

    this.hideSidenav = this.hideConditions.some(el =>
      this.router.routerState.snapshot.url.includes(el)
    );

    this.minimizeSidenav = this.minimizeConditions.some(el =>
      this.router.routerState.snapshot.url.includes(el)
    );

    if (!this.minimizeSidenav) {
      this.expandedSidenav = this.getSidenavState();
    } else {
      this.expandedSidenav = false;
    }

    this.router.events
      .pipe(
        withLatestFrom(this.isSmallScreen$),
        filter(([event, isSmallScreen]) => isSmallScreen && event instanceof NavigationEnd),
        takeUntil(this.onDestroy$)
      )
      .subscribe(() => {
        this.layout.container.sidenav.close();
      });

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.onDestroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.minimizeSidenav = this.minimizeConditions.some(el =>
          event.urlAfterRedirects.includes(el)
        );
        this.hideSidenav = this.hideConditions.some(el => event.urlAfterRedirects.includes(el));

        this.updateState();
      });
    this.alfrescoApiService.getInstance().on('error', (error: { status: number }) => {
      if (error.status === 401) {
        if (!this.authenticationService.isLoggedIn()) {
          let redirectUrl = this.route.snapshot.queryParams['redirectUrl'];
          if (!redirectUrl) {
            redirectUrl = this.router.url;
          }
          this.router.navigate(['/login'], {
            queryParams: { redirectUrl: redirectUrl }
          });
        }
      }
    });
    this.appService.ready$.pipe(takeUntil(this.onDestroy$)).subscribe(isReady => {
      if (isReady) {
        this.loadUserProfile();
      }
    });
  }
  private async loadUserProfile() {
    const groupsApi = new GroupsApi(this.alfrescoApiService.getInstance());
    const paging = await groupsApi.listGroupMembershipsForPerson('-me-');
    const groups: Group[] = [];

    if (paging && paging.list && paging.list.entries) {
      groups.push(...paging.list.entries.map(obj => obj.entry));
    }

    this.contentApi.getCurrentPerson().subscribe(person => {
      this.store.dispatch(new SetUserProfileAction({ person: person.entry, groups }));
    });
  }

  loadAppSettings() {
    const state: AppState = {
      ...INITIAL_APP_STATE,
      languagePicker: this.appConfigService.get<boolean>('languagePicker'),
      appName: this.appConfigService.get<string>('application.name'),
      headerColor: this.appConfigService.get<string>('headerColor'),
      logoPath: this.appConfigService.get<string>('application.logo')
    };
    this.store.dispatch(new SetInitialStateAction(state));
  }
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
  hideMenu(event: Event) {
    if (this.layout.container.isMobileScreenSize) {
      event.preventDefault();
      this.layout.container.toggleMenu();
    }
  }

  private updateState() {
    if (this.minimizeSidenav && !this.layout.isMenuMinimized) {
      this.layout.isMenuMinimized = true;
      if (!this.layout.container.isMobileScreenSize) {
        this.layout.container.toggleMenu();
      }
    }

    if (!this.minimizeSidenav) {
      if (this.getSidenavState() && this.layout.isMenuMinimized) {
        this.layout.isMenuMinimized = false;
        this.layout.container.toggleMenu();
      }
    }
  }

  onExpanded(state: boolean) {
    if (!this.minimizeSidenav && this.appConfigService.get('sideNav.preserveState')) {
      this.userPreferenceService.set('expandedSidenav', state);
    }
  }

  private getSidenavState(): boolean {
    const expand = this.appConfigService.get<boolean>('sideNav.expandedSidenav', true);
    const preserveState = this.appConfigService.get<boolean>('sideNav.preserveState', true);

    if (preserveState) {
      return this.userPreferenceService.get('expandedSidenav', expand.toString()) === 'true';
    }

    return expand;
  }
}
