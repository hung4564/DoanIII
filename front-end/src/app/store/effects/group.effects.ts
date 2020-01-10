import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { ContentManagementService } from "app/services/content-management.service";
import { map, take } from "rxjs/operators";
import {
  CreateGroupAction,
  DeleteGroupAction,
  EditGroupAction,
  GroupActionTypes
} from "../actions/group.actions";
import { getAppSelection } from "../selectors/app.selector";

@Injectable()
export class GroupEffects {
  constructor(
    private store: Store<any>,
    private actions$: Actions,
    private content: ContentManagementService
  ) {}

  @Effect({ dispatch: false })
  createGroup$ = this.actions$.pipe(
    ofType<CreateGroupAction>(GroupActionTypes.Create),
    map(action => {
      this.content.createGroup();
    })
  );
  @Effect({ dispatch: false })
  editGroup$ = this.actions$.pipe(
    ofType<EditGroupAction>(GroupActionTypes.Edit),
    map(action => {
      if (action.payload) {
        this.content.editGroup(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && selection.first && selection.first["isGroup"]) {
              this.content.editGroup(<any>selection.first);
            }
          });
      }
    })
  );
  @Effect({ dispatch: false })
  deleteGroup$ = this.actions$.pipe(
    ofType<DeleteGroupAction>(GroupActionTypes.Delete),
    map(action => {
      if (action.payload) {
        this.content.deleteGroup(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && selection.first && selection.first["isGroup"]) {
              this.content.deleteGroup(selection.first.entry.id);
            }
          });
      }
    })
  );
}
