import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { AppStore } from 'app/store/states/app.state';
import { Store } from '@ngrx/store';
import { AppService } from 'app/services/app.service';
import { getUserProfile, getLanguagePickerState } from 'app/store/selectors/app.selector';
import { ProfileState } from '@alfresco/adf-extensions';

@Component({
  selector: 'app-current-user',
  templateUrl: './current-user.component.html',
  styleUrls: ['./current-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-current-user' }
})
export class CurrentUserComponent implements OnInit {
  profile$: Observable<ProfileState>;
  languagePicker$: Observable<boolean>;

  constructor(private store: Store<AppStore>, private appService: AppService) {
    this.profile$ = this.store.select(getUserProfile);
    this.languagePicker$ = store.select(getLanguagePickerState);
  }
  ngOnInit() {}

  get showLogout(): boolean {
    return !this.appService.withCredentials;
  }

  onLogoutEvent() {}
}