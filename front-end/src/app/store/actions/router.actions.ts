import { Action } from '@ngrx/store';
import { MinimalNodeEntity } from '@alfresco/js-api';

export enum RouterActionTypes {
  NavigateUrl = 'NAVIGATE_URL',
  NavigateRoute = 'NAVIGATE_ROUTE',
  NavigateFolder = 'NAVIGATE_FOLDER',
  NavigateParentFolder = 'NAVIGATE_PARENT_FOLDER'
}

export class NavigateUrlAction implements Action {
  readonly type = RouterActionTypes.NavigateUrl;

  constructor(public payload: string) {}
}

export class NavigateRouteAction implements Action {
  readonly type = RouterActionTypes.NavigateRoute;

  constructor(public payload: any[]) {}
}

export class NavigateToFolder implements Action {
  readonly type = RouterActionTypes.NavigateFolder;

  constructor(public payload: MinimalNodeEntity) {}
}

export class NavigateToParentFolder implements Action {
  readonly type = RouterActionTypes.NavigateParentFolder;

  constructor(public payload: MinimalNodeEntity) {}
}
