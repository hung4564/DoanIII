import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'environments/environment';
import { INITIAL_STATE } from './states/initial-state';
import { UploadEffects } from './effects/upload.effects';
import { SnackbarEffects } from './effects/snackbar.effects';
import { ViewerEffects } from './effects/viewer.effects';
import { AppEffects } from './effects/app.efects';
import { DownloadEffects } from './effects/download.effects';
import { NodeEffects } from './effects/node.effects';
import { RouterEffects } from './effects/router.effects';
import { appReducer } from './reducers/app.reducer';

@NgModule({
  imports: [
    EffectsModule.forRoot([
      SnackbarEffects,
      ViewerEffects,
      AppEffects,
      DownloadEffects,
      NodeEffects,
      RouterEffects,
      UploadEffects
    ]),
    StoreModule.forRoot({ app: appReducer }, { initialState: INITIAL_STATE }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production // Restrict extension to log-only mode
    })
  ],
  declarations: []
})
export class AppStoreModule {}
