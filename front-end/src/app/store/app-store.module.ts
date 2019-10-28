import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './reducers/app.reducer';
import { EffectsModule } from '@ngrx/effects';
import { SnackbarEffects } from './effects/snackbar.effects';

import { INITIAL_STATE } from './states/initial-state';
@NgModule({
  imports: [
    EffectsModule.forRoot([SnackbarEffects]),
    StoreModule.forRoot({ app: appReducer }, { initialState: INITIAL_STATE })
  ],
  declarations: []
})
export class AppStoreModule {}
