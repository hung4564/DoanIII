import { Action } from '@ngrx/store';
import { AppState } from '../states/app.state';
import {
  AppActionTypes,
  SetUserProfileAction,
  SetLanguagePickerAction,
  SetInitialStateAction
} from '../actions/app.action';
import { INITIAL_APP_STATE } from '../states/initial-state';

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
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const userName = `${firstName} ${lastName}`;
    const initials = [firstName[0], lastName[0]].join('');

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
