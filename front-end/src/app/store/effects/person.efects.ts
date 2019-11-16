import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ContentManagementService } from 'app/services/content-management.service';
import {
  EditPersonAction,
  PersonActionTypes,
  DeletePersonAction,
  CreatePersonAction
} from '../actions/person.action';
import { map, take } from 'rxjs/operators';
import { getAppSelection } from '../selectors/app.selector';

@Injectable()
export class PersonEffects {
  constructor(
    private store: Store<any>,
    private actions$: Actions,
    private content: ContentManagementService
  ) {}

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
            if (selection && selection.first && selection.first['isPeople']) {
              this.content.editPerson(<any>selection.first);
            }
          });
      }
    })
  );
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
            if (selection && selection.first && selection.first['isPeople']) {
              this.content.deletePerson(selection.first.entry.id);
            }
          });
      }
    })
  );
}
