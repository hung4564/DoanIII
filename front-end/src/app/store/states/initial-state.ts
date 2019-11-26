import { AppState, AppStore } from './app.state';

export const INITIAL_APP_STATE: AppState = {
  appName: 'Alfresco Content Application',
  headerColor: '',
  logoPath: 'assets/images/favicon.ico',
  languagePicker: false,
  sharedUrl: '',
  user: {
    isAdmin: false,
    id: null,
    firstName: '',
    lastName: ''
  },
  infoDrawerOpened: false,
  infoDrawerMetadataAspect: '',
  selection: {
    nodes: [],
    libraries: [],
    isEmpty: true,
    count: 0
  },
  navigation: {},
  repository: <any>{
    status: <any>{
      isQuickShareEnabled: true
    }
  },
  isSmallScreen: false,
  showFacetFilter: true
};

export const INITIAL_STATE: AppStore = {
  app: INITIAL_APP_STATE
};
