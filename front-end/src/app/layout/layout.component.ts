import { Component, OnInit, ViewChild } from '@angular/core';
import {
  SidenavLayoutComponent,
  UserPreferencesService,
  AppConfigService
} from '@alfresco/adf-core';
import { Subject, Observable } from 'rxjs';
import { Directionality } from '@angular/cdk/bidi';
import { Store } from '@ngrx/store';
import { AppStore } from 'app/store/states/app.state';
import { Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, withLatestFrom, filter, takeUntil } from 'rxjs/operators';
import { LayoutService } from './layout.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  host: {
    class: 'app-layout'
  }
})
export class LayoutComponent implements OnInit {
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
    protected store: Store<AppStore>,
    private router: Router,
    private userPreferenceService: UserPreferencesService,
    private appConfigService: AppConfigService,
    private breakpointObserver: BreakpointObserver,
    private layoutSV: LayoutService
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
    this.layoutSV.toggleSide(state);
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
