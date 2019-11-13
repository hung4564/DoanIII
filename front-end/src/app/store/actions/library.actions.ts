import { Action } from '@ngrx/store';
import { SiteBody } from '@alfresco/js-api';

export enum LibraryActionTypes {
  Delete = 'DELETE_LIBRARY',
  Create = 'CREATE_LIBRARY',
  Navigate = 'NAVIGATE_LIBRARY',
  Update = 'UPDATE_LIBRARY',
  Leave = 'LEAVE_LIBRARY'
}

export class DeleteLibraryAction implements Action {
  readonly type = LibraryActionTypes.Delete;

  constructor(public payload?: string) {}
}

export class CreateLibraryAction implements Action {
  readonly type = LibraryActionTypes.Create;
}

export class NavigateLibraryAction implements Action {
  readonly type = LibraryActionTypes.Navigate;

  constructor(public payload?: string) {}
}

export class UpdateLibraryAction implements Action {
  readonly type = LibraryActionTypes.Update;

  constructor(public payload?: SiteBody) {}
}

export class LeaveLibraryAction implements Action {
  readonly type = LibraryActionTypes.Leave;

  constructor(public payload?: string) {}
}
