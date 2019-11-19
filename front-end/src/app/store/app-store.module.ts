import { NgModule } from "@angular/core";
import { StoreModule } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from "environments/environment";
import { INITIAL_STATE } from "./states/initial-state";
import { UploadEffects } from "./effects/upload.effects";
import { SnackbarEffects } from "./effects/snackbar.effects";
import { ViewerEffects } from "./effects/viewer.effects";
import { AppEffects } from "./effects/app.effects";
import { DownloadEffects } from "./effects/download.effects";
import { NodeEffects } from "./effects/node.effects";
import { RouterEffects } from "./effects/router.effects";
import { appReducer } from "./reducers/app.reducer";
import { LibraryEffects } from "./effects/library.effects";
import { FavoriteEffects } from "./effects/favorite.effects";
import { PersonEffects } from "./effects/person.efects";
import { GroupEffects } from "./effects/group.effects";
import { SearchEffects } from "./effects/search.effects";
import { TaskEffects } from "./effects/task.effects";

@NgModule({
  imports: [
    EffectsModule.forRoot([
      SnackbarEffects,
      ViewerEffects,
      AppEffects,
      DownloadEffects,
      NodeEffects,
      RouterEffects,
      UploadEffects,
      LibraryEffects,
      FavoriteEffects,
      PersonEffects,
      GroupEffects,
      SearchEffects,
      TaskEffects
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
