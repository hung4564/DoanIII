import { Effect, Actions, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { CreateTaskAction, TaskActionTypes, ChangeFormTaskAction } from "../actions/task.action";
import { Store } from "@ngrx/store";
import { AppStore } from "../states/app.state";
import { NavigateRouteAction } from "../actions/router.actions";
import { ContentManagementService } from "app/services/content-management.service";

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
