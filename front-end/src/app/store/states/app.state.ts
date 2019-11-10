import { SelectionState, ProfileState, NavigationState } from '@alfresco/adf-extensions';
import { RepositoryInfo } from '@alfresco/js-api';

export interface AppState {
  appName: string;
  headerColor: string;
  logoPath: string;
  languagePicker: boolean;
  selection: SelectionState;
  user: ProfileState;
  navigation: NavigationState;
  sharedUrl: string;
  repository: RepositoryInfo;
}

export interface AppStore {
  app: AppState;
}
