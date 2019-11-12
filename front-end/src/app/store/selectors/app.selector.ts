import { createSelector } from '@ngrx/store';
import { AppStore } from '../states/app.state';

export const selectApp = (state: AppStore) => state.app;

export const getHeaderColor = createSelector(
  selectApp,
  state => state.headerColor
);

export const getAppName = createSelector(
  selectApp,
  state => state.appName
);

export const getLogoPath = createSelector(
  selectApp,
  state => state.logoPath
);

export const getLanguagePickerState = createSelector(
  selectApp,
  state => state.languagePicker
);

export const getUserProfile = createSelector(
  selectApp,
  state => state.user
);

export const getCurrentFolder = createSelector(
  selectApp,
  state => state.navigation.currentFolder
);

export const getAppSelection = createSelector(
  selectApp,
  state => state.selection
);

export const getSharedUrl = createSelector(
  selectApp,
  state => state.sharedUrl
);

export const getNavigationState = createSelector(
  selectApp,
  state => state.navigation
);

export const isAdmin = createSelector(
  selectApp,
  state => state.user.isAdmin
);

export const getSideNavState = createSelector(
  getAppSelection,
  getNavigationState,
  (selection, navigation) => {
    return {
      selection,
      navigation
    };
  }
);

export const getRepositoryStatus = createSelector(
  selectApp,
  state => state.repository
);
export const getRuleContext = createSelector(
  getAppSelection,
  getNavigationState,
  getUserProfile,
  getRepositoryStatus,
  (selection, navigation, profile, repository) => {
    return {
      selection,
      navigation,
      profile,
      repository
    };
  }
);
export const isQuickShareEnabled = createSelector(
  getRepositoryStatus,
  info => info.status.isQuickShareEnabled
);
