import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { ContentManagementService } from "app/services/content-management.service";
import { map } from "rxjs/operators";
import { NavigateRouteAction } from "../actions/router.actions";
import {
  ChangeFormTaskAction,
  CreateTaskAction,
  TaskActionTypes
} from "../actions/task.actions";
import { AppStore } from "../states/app.state";

@Injectable()
export class TaskEffects {
  constructor(
    private actions$: Actions,
    private store: Store<AppStore>,
    private content: ContentManagementService
  ) {}

  @Effect({ dispatch: false })
  createTask = this.actions$.pipe(
    ofType<CreateTaskAction>(TaskActionTypes.Create),
    map((action: CreateTaskAction) => {
      this.store.dispatch(new NavigateRouteAction(["tasks", "create"]));
    })
  );
  @Effect({ dispatch: false })
  changeFormTask = this.actions$.pipe(
    ofType<ChangeFormTaskAction>(TaskActionTypes.ChangeFormTask),
    map((action: ChangeFormTaskAction) => {
      this.content.changeTaskForm.next(action.payload);
    })
  );
}
