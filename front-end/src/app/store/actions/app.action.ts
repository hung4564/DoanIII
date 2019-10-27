import { Action } from '@ngrx/store';
import { Node, Person, Group, RepositoryInfo } from '@alfresco/js-api';
import { AppState } from '../states/app.state';

export enum AppActionTypes {
  SetInitialState = 'SET_INITIAL_STATE',
  SetLanguagePicker = 'SET_LANGUAGE_PICKER',
  SetUserProfile = 'SET_USER_PROFILE',
  Logout = 'LOGOUT'
}

export class SetInitialStateAction implements Action {
  readonly type = AppActionTypes.SetInitialState;

  constructor(public payload: AppState) {}
}

export class SetLanguagePickerAction implements Action {
  readonly type = AppActionTypes.SetLanguagePicker;

  constructor(public payload: boolean) {}
}

export class SetUserProfileAction implements Action {
  readonly type = AppActionTypes.SetUserProfile;

  constructor(public payload: { person: Person; groups: Group[] }) {
  }
}

export class LogoutAction implements Action {
  readonly type = AppActionTypes.Logout;
}
