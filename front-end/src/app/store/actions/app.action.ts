import { Action } from "@ngrx/store";
import { Node, Person, Group, RepositoryInfo, Site } from "@alfresco/js-api";
import { AppState } from "../states/app.state";

export enum AppActionTypes {
  SetInitialState = "SET_INITIAL_STATE",
  SetLanguagePicker = "SET_LANGUAGE_PICKER",
  SetUserProfile = "SET_USER_PROFILE",
  Logout = "LOGOUT",
  ReloadDocumentList = "RELOAD_DOCUMENT_LIST",
  SetCurrentUrl = "SET_CURRENT_URL",
  SetRepositoryInfo = "SET_REPOSITORY_INFO",
  SetCurrentFolder = "SET_CURRENT_FOLDER",
  ToggleInfoDrawer = "TOGGLE_INFO_DRAWER",
  SetInfoDrawerState = "SET_INFO_DRAWER_STATE",
  SetInfoDrawerMetadataAspect = "SET_INFO_DRAWER_METADATA_ASPECT",
  SetSmallScreen = "SET_SMALL_SCREEN",
  ResetSelection = "RESET_SELECTION",
  SetCurrentLibrary = "SET_CURRENT_LIBRARY"
}
export class ResetSelectionAction implements Action {
  readonly type = AppActionTypes.ResetSelection;

  constructor(public payload?: any) {}
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

  constructor(public payload: { person: Person; groups: Group[] }) {}
}

export class LogoutAction implements Action {
  readonly type = AppActionTypes.Logout;
}
export class ReloadDocumentListAction implements Action {
  readonly type = AppActionTypes.ReloadDocumentList;

  constructor(public payload?: any) {}
}

export class SetCurrentUrlAction implements Action {
  readonly type = AppActionTypes.SetCurrentUrl;

  constructor(public payload: string) {}
}

export class SetRepositoryInfoAction implements Action {
  readonly type = AppActionTypes.SetRepositoryInfo;

  constructor(public payload: RepositoryInfo) {}
}
export class SetCurrentFolderAction implements Action {
  readonly type = AppActionTypes.SetCurrentFolder;

  constructor(public payload: Node) {}
}
export class ToggleInfoDrawerAction implements Action {
  readonly type = AppActionTypes.ToggleInfoDrawer;
}
export class SetInfoDrawerStateAction implements Action {
  readonly type = AppActionTypes.SetInfoDrawerState;

  constructor(public payload: boolean) {}
}
export class SetInfoDrawerMetadataAspectAction implements Action {
  readonly type = AppActionTypes.SetInfoDrawerMetadataAspect;
  constructor(public payload: string) {}
}
export class SetSmallScreenAction implements Action {
  readonly type = AppActionTypes.SetSmallScreen;
  constructor(public payload: boolean) {}
}
export class SetCurrentLibraryAction implements Action {
  readonly type = AppActionTypes.SetCurrentLibrary;

  constructor(public payload: Site) {}
}
