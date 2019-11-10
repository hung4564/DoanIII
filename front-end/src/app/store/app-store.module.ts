import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './reducers/app.reducer';
import { EffectsModule } from '@ngrx/effects';
import { SnackbarEffects } from './effects/snackbar.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { INITIAL_STATE } from './states/initial-state';
import { environment } from 'environments/environment';
import { ViewerEffects } from './effects/viewer.effects';
import { AppEffects } from './effects/app.efects';
import { DownloadEffects } from './effects/download.effects';
@NgModule({
  imports: [
    EffectsModule.forRoot([SnackbarEffects, ViewerEffects, AppEffects, DownloadEffects]),
    StoreModule.forRoot({ app: appReducer }, { initialState: INITIAL_STATE }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production // Restrict extension to log-only mode
    })
  ],
  declarations: []
})
export class AppStoreModule {}
