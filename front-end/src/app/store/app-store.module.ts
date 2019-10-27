import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './reducers/app.reducer';
import { INITIAL_STATE } from './states/initial-state';
@NgModule({
  imports: [StoreModule.forRoot({ app: appReducer }, { initialState: INITIAL_STATE })],
  declarations: []
})
export class AppStoreModule {}
