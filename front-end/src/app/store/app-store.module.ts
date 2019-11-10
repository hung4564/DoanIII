import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  SnackbarEffects,
  ViewerEffects,
  AppEffects,
  NodeEffects,
  RouterEffects,
  appReducer,
  DownloadEffects
} from '.';
import { environment } from 'environments/environment';
import { INITIAL_STATE } from './states/initial-state';

@NgModule({
  imports: [
    EffectsModule.forRoot([
      SnackbarEffects,
      ViewerEffects,
      AppEffects,
      DownloadEffects,
      NodeEffects,
      RouterEffects
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
