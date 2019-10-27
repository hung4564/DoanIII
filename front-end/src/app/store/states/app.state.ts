import {
  SelectionState,
  ProfileState,
  NavigationState
} from '@alfresco/adf-extensions';

export interface AppState {
  appName: string;
  headerColor: string;
  logoPath: string;
  languagePicker: boolean;
  selection: SelectionState;
  user: ProfileState;
  navigation: NavigationState;
}

export interface AppStore {
  app: AppState;
}
