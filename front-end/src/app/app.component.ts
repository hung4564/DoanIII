import {
  AlfrescoApiService,
  AppConfigService,
  AuthenticationService,
  FileUploadErrorEvent,
  PageTitleService,
  UploadService,
  SharedLinksApiService,
  TranslationService
} from '@alfresco/adf-core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, ActivationEnd } from '@angular/router';
import { Store } from '@ngrx/store';

import { filter, takeUntil, map } from 'rxjs/operators';
import { AppService } from './services/app.service';
import { GroupsApi, Group, DiscoveryEntry } from '@alfresco/js-api';
import { Subject, from, Observable } from 'rxjs';
import { AppStore, AppState } from './store/states/app.state';
import {
  SetUserProfileAction,
  SetInitialStateAction,
  SetRepositoryInfoAction,
  SetCurrentUrlAction,
  SetSmallScreenAction
} from './store/actions/app.action';
import { INITIAL_APP_STATE } from './store/states/initial-state';
import { SnackbarErrorAction } from './store/actions/snackbar.actions';
import { ContentApiService } from './services/content-api.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  onDestroy$: Subject<boolean> = new Subject<boolean>();
  pageHeading = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pageTitle: PageTitleService,
    private store: Store<any>,
    private config: AppConfigService,
    private alfrescoApiService: AlfrescoApiService,
    private authenticationService: AuthenticationService,
    private uploadService: UploadService,
    private appService: AppService,
    private sharedLinksApiService: SharedLinksApiService,
    private transSV: TranslationService,
    private contentApi: ContentApiService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.transSV.use('en');
  }
  ngOnInit() {
    this.alfrescoApiService.getInstance().on('error', (error: { status: number }) => {
      if (error.status === 401) {
        if (!this.authenticationService.isLoggedIn()) {
          // this.store.dispatch(new CloseModalDialogsAction());

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

    this.loadAppSettings();

    const { router, pageTitle } = this;

    this.router.events
      .pipe(
        filter(
          event =>
            event instanceof ActivationEnd &&
            event.snapshot.children.length === 0 &&
            event.snapshot.outlet === 'primary'
        )
      )
      .subscribe((event: ActivationEnd) => {
        const snapshot: any = event.snapshot || {};
        const data: any = snapshot.data || {};

        this.pageHeading = data.title || '';
        pageTitle.setTitle(data.title || '');
        this.store.dispatch(new SetCurrentUrlAction(router.url));
      });

    this.uploadService.fileUploadError.subscribe(error => this.onFileUploadedError(error));

    this.sharedLinksApiService.error
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((err: { message: string }) => {
        this.store.dispatch(new SnackbarErrorAction(err.message));
      });

    this.appService.ready$.pipe(takeUntil(this.onDestroy$)).subscribe(isReady => {
      if (isReady) {
        this.loadRepositoryStatus();
        this.loadUserProfile();
      }
    });
    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .subscribe(result => {
        this.store.dispatch(new SetSmallScreenAction(result.matches));
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
  private async loadUserProfile() {
    try {
      const groupsApi = new GroupsApi(this.alfrescoApiService.getInstance());
      const paging = await groupsApi.listGroupMembershipsForPerson('-me-');
      const groups: Group[] = [];

      if (paging && paging.list && paging.list.entries) {
        groups.push(...paging.list.entries.map(obj => obj.entry));
      }
      from(this.alfrescoApiService.peopleApi.getPerson('-me-')).subscribe(person => {
        this.store.dispatch(new SetUserProfileAction({ person: person.entry, groups }));
      });
    } catch (err) {
      let redirectUrl = this.route.snapshot.queryParams['redirectUrl'];
      if (!redirectUrl) {
        redirectUrl = this.router.url;
      }
      this.router.navigate(['/login'], {
        queryParams: { redirectUrl: redirectUrl }
      });
    }
  }
  loadAppSettings() {
    let baseShareUrl = this.config.get<string>('baseShareUrl');
    if (!baseShareUrl.endsWith('/')) {
      baseShareUrl += '/';
    }
    const state: AppState = {
      ...INITIAL_APP_STATE,
      sharedUrl: baseShareUrl,
      languagePicker: this.config.get<boolean>('languagePicker'),
      appName: this.config.get<string>('application.name'),
      headerColor: this.config.get<string>('headerColor'),
      logoPath: this.config.get<string>('application.logo')
    };
    this.store.dispatch(new SetInitialStateAction(state));
  }
  private loadRepositoryStatus() {
    this.contentApi.getRepositoryInformation().subscribe((response: DiscoveryEntry) => {
      this.store.dispatch(new SetRepositoryInfoAction(response.entry.repository));
    });
  }
  onFileUploadedError(error: FileUploadErrorEvent) {
    let message = 'APP.MESSAGES.UPLOAD.ERROR.GENERIC';

    if (error.error.status === 403) {
      message = 'APP.MESSAGES.UPLOAD.ERROR.403';
    }

    if (error.error.status === 404) {
      message = 'APP.MESSAGES.UPLOAD.ERROR.404';
    }

    if (error.error.status === 409) {
      message = 'APP.MESSAGES.UPLOAD.ERROR.CONFLICT';
    }

    if (error.error.status === 500) {
      message = 'APP.MESSAGES.UPLOAD.ERROR.500';
    }

    if (error.error.status === 504) {
      message = 'APP.MESSAGES.UPLOAD.ERROR.504';
    }

    this.store.dispatch(new SnackbarErrorAction(message));
  }
}
