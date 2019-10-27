import { Component, OnInit } from '@angular/core';
import {
  PeopleContentService,
  AppConfigService,
  AuthenticationService,
  AlfrescoApiService
} from '@alfresco/adf-core';
import { AppStore, AppState } from 'app/store/states/app.state';
import { Store } from '@ngrx/store';
import { GroupsApi, Group } from '@alfresco/js-api';
import { filter, takeUntil } from 'rxjs/operators';
import { INITIAL_APP_STATE } from 'app/store/states/initial-state';
import { SetUserProfileAction, SetInitialStateAction } from 'app/store/actions/app.action';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'app/services/app.service';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  onDestroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private alfrescoApiService: AlfrescoApiService,
    private authenticationService: AuthenticationService,
    private store: Store<AppStore>,
    private contentApi: PeopleContentService,
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
    private config: AppConfigService,
  ) {}

  ngOnInit() {
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
      languagePicker: this.config.get<boolean>('languagePicker'),
      appName: this.config.get<string>('application.name'),
      headerColor: this.config.get<string>('headerColor'),
      logoPath: this.config.get<string>('application.logo')
    };
    this.store.dispatch(new SetInitialStateAction(state));
  }
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
