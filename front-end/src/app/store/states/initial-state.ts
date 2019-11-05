import { AppState, AppStore } from './app.state';

export const INITIAL_APP_STATE: AppState = {
  appName: 'Alfresco Content Application',
  headerColor: '#2196F3',
  logoPath: 'assets/images/alfresco-logo-flower.svg',
  languagePicker: false,
  sharedUrl: '',
  user: {
    isAdmin: null,
    id: null,
    firstName: '',
    lastName: ''
  },
  selection: {
    nodes: [],
    libraries: [],
    isEmpty: true,
    count: 0
  },
  navigation: {
  }
};

export const INITIAL_STATE: AppStore = {
  app: INITIAL_APP_STATE
};
