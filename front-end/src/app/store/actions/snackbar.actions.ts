import { Action } from '@ngrx/store';

export enum SnackbarActionTypes {
  Info = 'SNACKBAR_INFO',
  Warning = 'SNACKBAR_WARNING',
  Error = 'SNACKBAR_ERROR'
}

export interface SnackbarAction extends Action {
  payload: string;
  params?: Object;
  userAction?: SnackbarUserAction;
  duration: number;
}

export class SnackbarUserAction {
  constructor(public title: string, public action: Action) {}
}

export class SnackbarInfoAction implements SnackbarAction {
  readonly type = SnackbarActionTypes.Info;

  userAction?: SnackbarUserAction;
  duration = 4000;

  constructor(public payload: string, public params?: Object) {}
}

export class SnackbarWarningAction implements SnackbarAction {
  readonly type = SnackbarActionTypes.Warning;

  userAction?: SnackbarUserAction;
  duration = 4000;

  constructor(public payload: string, public params?: Object) {}
}

export class SnackbarErrorAction implements SnackbarAction {
  readonly type = SnackbarActionTypes.Error;

  userAction?: SnackbarUserAction;
  duration = 4000;

  constructor(public payload: string, public params?: Object) {}
}
