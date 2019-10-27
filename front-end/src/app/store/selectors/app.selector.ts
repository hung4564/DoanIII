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
