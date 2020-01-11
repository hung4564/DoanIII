import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { ContentApiService } from "app/services/content-api.service";
import { ContentManagementService } from "app/services/content-management.service";
import { map, take } from "rxjs/operators";
import { loadPaging } from "../actions/entity.actions";
import {
  CreatePersonAction,
  DeletePersonAction,
  EditPersonAction,
  GetDataPersonAction,
  PersonActionTypes
} from "../actions/person.actions";
import { getAppSelection } from "../selectors/app.selector";

@Injectable()
export class PersonEffects {
  constructor(
    private store: Store<any>,
    private actions$: Actions,
    private content: ContentManagementService,
    private contentApi: ContentApiService
  ) {}
  @Effect({ dispatch: false })
  getdataPerson$ = this.actions$.pipe(
    ofType<GetDataPersonAction>(PersonActionTypes.GetData),
    map(action => {
      this.contentApi.getPeople(action.payload.filter).subscribe(result => {
        this.store.dispatch(loadPaging({ paging: result }));
      });
    })
  );
  @Effect({ dispatch: false })
  createPerson$ = this.actions$.pipe(
    ofType<CreatePersonAction>(PersonActionTypes.Create),
    map(action => {
      this.content.createPerson();
    })
  );
  @Effect({ dispatch: false })
  editPerson$ = this.actions$.pipe(
    ofType<EditPersonAction>(PersonActionTypes.Edit),
    map(action => {
      if (action.payload) {
        this.content.editPerson(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && selection.first && selection.first["isPeople"]) {
              this.content.editPerson(<any>selection.first);
            }
          });
      }
    })
  );
  @Effect({ dispatch: false })
  deletePeople$ = this.actions$.pipe(
    ofType<DeletePersonAction>(PersonActionTypes.Delete),
    map(action => {
      if (action.payload) {
        this.content.deletePerson(action.payload);
      } else {
        this.store
          .select(getAppSelection)
          .pipe(take(1))
          .subscribe(selection => {
            if (selection && selection.first && selection.first["isPeople"]) {
              this.content.deletePerson(selection.first.entry.id);
            }
          });
      }
    })
  );
}
