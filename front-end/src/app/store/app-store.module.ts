import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { environment } from "environments/environment";
import { AppEffects } from "./effects/app.effects";
import { DownloadEffects } from "./effects/download.effects";
import { FavoriteEffects } from "./effects/favorite.effects";
import { GroupEffects } from "./effects/group.effects";
import { LibraryEffects } from "./effects/library.effects";
import { NodeEffects } from "./effects/node.effects";
import { PersonEffects } from "./effects/person.effects";
import { RouterEffects } from "./effects/router.effects";
import { SearchEffects } from "./effects/search.effects";
import { SnackbarEffects } from "./effects/snackbar.effects";
import { TaskEffects } from "./effects/task.effects";
import { UploadEffects } from "./effects/upload.effects";
import { ViewerEffects } from "./effects/viewer.effects";
import { appReducer } from "./reducers/app.reducer";
import * as fromEntity from "./reducers/entity.reducer";
import { INITIAL_STATE } from "./states/initial-state";

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
      maxAge: 25,
      logOnly: environment.production
    }),
    StoreModule.forFeature(fromEntity.entitiesFeatureKey, fromEntity.reducer)
  ],
  declarations: []
})
export class AppStoreModule {}
