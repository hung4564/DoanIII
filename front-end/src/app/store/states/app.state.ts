import { SelectionState, ProfileState } from "@alfresco/adf-extensions";
import { RepositoryInfo } from "@alfresco/js-api";
import { CustomNavigationState } from "app/model/custom-rule-context.model";

export interface AppState {
  appName: string;
  headerColor: string;
  logoPath: string;
  languagePicker: boolean;
  selection: SelectionState;
  user: ProfileState;
  navigation: CustomNavigationState;
  sharedUrl: string;
  repository: RepositoryInfo;
  infoDrawerOpened: boolean;
  infoDrawerMetadataAspect: string;
  isSmallScreen: boolean;
  showFacetFilter: boolean;
}

export interface AppStore {
  app: AppState;
}
