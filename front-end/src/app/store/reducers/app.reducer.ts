import { Action } from "@ngrx/store";
import { AppState } from "../states/app.state";
import {
  AppActionTypes,
  SetUserProfileAction,
  SetLanguagePickerAction,
  SetInitialStateAction,
  SetCurrentUrlAction,
  SetRepositoryInfoAction,
  SetCurrentFolderAction,
  SetInfoDrawerStateAction,
  SetInfoDrawerMetadataAspectAction,
  SetSmallScreenAction,
  SetCurrentLibraryAction
} from "../actions/app.action";
import { INITIAL_APP_STATE } from "../states/initial-state";
import { NodeActionTypes, SetSelectedNodesAction } from "../actions/node.action";
import { SearchActionTypes } from "../actions/search.actions";

export function appReducer(state: AppState = INITIAL_APP_STATE, action: Action): AppState {
  let newState: AppState;
  switch (action.type) {
    case AppActionTypes.SetInitialState:
      newState = Object.assign({}, (<SetInitialStateAction>action).payload);
      break;
    case AppActionTypes.SetUserProfile:
      newState = updateUser(state, <SetUserProfileAction>action);
      break;
    case AppActionTypes.Logout:
      const temp: SetUserProfileAction = {
        type: AppActionTypes.SetUserProfile,
        payload: { person: undefined, groups: [] }
      };
      newState = updateUser(state, <SetUserProfileAction>temp);
      break;
    case AppActionTypes.SetCurrentLibrary:
      newState = updateCurrentLibrary(state, <SetCurrentLibraryAction>action);
      break;
    case AppActionTypes.SetCurrentFolder:
      newState = updateCurrentFolder(state, <SetCurrentFolderAction>action);
      break;
    case AppActionTypes.SetCurrentUrl:
      newState = updateCurrentUrl(state, <SetCurrentUrlAction>action);
      break;
    case AppActionTypes.SetRepositoryInfo:
      newState = updateRepositoryStatus(state, <SetRepositoryInfoAction>action);
      break;
    case NodeActionTypes.SetSelection:
      newState = updateSelectedNodes(state, <SetSelectedNodesAction>action);
      break;
    case AppActionTypes.ToggleInfoDrawer:
      newState = toggleInfoDrawer(state);
      break;
    case AppActionTypes.SetInfoDrawerState:
      newState = setInfoDrawer(state, <SetInfoDrawerStateAction>action);
      break;
    case AppActionTypes.SetInfoDrawerMetadataAspect:
      newState = setInfoDrawerAspect(state, <SetInfoDrawerMetadataAspectAction>action);
      break;
    case AppActionTypes.SetSmallScreen:
      newState = setSmallScreen(state, <SetSmallScreenAction>action);
      break;
    case SearchActionTypes.ToggleFilter:
      newState = toggleSearchFilter(state);
      break;
    case SearchActionTypes.ShowFilter:
      newState = showSearchFilter(state);
      break;
    case SearchActionTypes.HideFilter:
      newState = hideSearchFilter(state);
      break;
    default:
      newState = Object.assign({}, state);
      break;
  }
  return newState;
}

function updateUser(state: AppState, action: SetUserProfileAction): AppState {
  const newState = Object.assign({}, state);
  if (action.payload.person) {
    const user = action.payload.person;
    const groups = [...(action.payload.groups || [])];

    const id = user.id;
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    const userName = `${firstName} ${lastName}`;
    const initials = [firstName[0], lastName[0]].join("");

    const capabilities = (<any>user).capabilities;
    const isAdmin = capabilities ? capabilities.isAdmin : true;

    // todo: remove <any>
    newState.user = <any>{
      firstName,
      lastName,
      userName,
      initials,
      isAdmin,
      id,
      groups
    };
  } else {
    newState.user = <any>{};
  }

  return newState;
}

function updateCurrentUrl(state: AppState, action: SetCurrentUrlAction) {
  const newState = Object.assign({}, state);
  newState.navigation.url = action.payload;
  return newState;
}

function updateRepositoryStatus(state: AppState, action: SetRepositoryInfoAction) {
  const newState = Object.assign({}, state);
  newState.repository = action.payload;
  return newState;
}
function updateSelectedNodes(state: AppState, action: SetSelectedNodesAction): AppState {
  const newState = Object.assign({}, state);
  const nodes = [...action.payload];
  const count = nodes.length;
  const isEmpty = nodes.length === 0;

  let first = null;
  let last = null;
  let file = null;
  let folder = null;
  let library = null;

  if (nodes.length > 0) {
    first = nodes[0];
    last = nodes[nodes.length - 1];

    if (nodes.length === 1) {
      file = nodes.find((entity: any) => {
        // workaround Shared
        return entity.entry.isFile || entity.entry.nodeId || entity.entry.sharedByUser
          ? true
          : false;
      });
      folder = nodes.find((entity: any) => entity.entry.isFolder);
    }
  }

  const libraries: any[] = [...action.payload].filter((node: any) => node.isLibrary);
  if (libraries.length === 1) {
    library = libraries[0];
  }

  // if (isEmpty) {
  //   newState.infoDrawerOpened = false;
  // }

  newState.selection = {
    count,
    nodes,
    isEmpty,
    first,
    last,
    file,
    folder,
    libraries,
    library
  };
  return newState;
}

function updateCurrentFolder(state: AppState, action: SetCurrentFolderAction) {
  const newState = Object.assign({}, state);
  newState.navigation.currentFolder = action.payload;
  return newState;
}
function toggleInfoDrawer(state: AppState) {
  const newState = Object.assign({}, state);

  let value = state.infoDrawerOpened;
  if (state.selection.isEmpty) {
    value = false;
  } else {
    value = !value;
  }

  newState.infoDrawerOpened = value;

  return newState;
}
function setInfoDrawer(state: AppState, action: SetInfoDrawerStateAction) {
  const newState = Object.assign({}, state);
  newState.infoDrawerOpened = action.payload;
  return newState;
}

function setInfoDrawerAspect(state: AppState, action: SetInfoDrawerMetadataAspectAction) {
  const newState = Object.assign({}, state);
  newState.infoDrawerMetadataAspect = action.payload;
  return newState;
}
function setSmallScreen(state: AppState, action: SetSmallScreenAction) {
  const newState = Object.assign({}, state);
  newState.isSmallScreen = action.payload;
  return newState;
}
function toggleSearchFilter(state: AppState): AppState {
  const newState = Object.assign({}, state);
  newState.showFacetFilter = !newState.showFacetFilter;
  return newState;
}

function hideSearchFilter(state: AppState): AppState {
  const newState = Object.assign({}, state);
  newState.showFacetFilter = false;
  return newState;
}

function showSearchFilter(state: AppState): AppState {
  const newState = Object.assign({}, state);
  newState.showFacetFilter = true;
  return newState;
}
function updateCurrentLibrary(state: AppState, action: SetCurrentLibraryAction): AppState {
  const newState = Object.assign({}, state);
  newState.navigation.currentSite = action.payload;
  return newState;
}
