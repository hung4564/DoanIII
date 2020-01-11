import { PersonEntry } from "@alfresco/js-api";
import { Action } from "@ngrx/store";
export enum PersonActionTypes {
  GetData = "GET_DATA_PERSON",
  Delete = "DELETE_PERSON",
  Create = "CREATE_PERSON",
  Edit = "EDIT_PERSON"
}
export class GetDataPersonAction implements Action {
  readonly type = PersonActionTypes.GetData;

  constructor(public payload: { filter: any }) {}
}
export class DeletePersonAction implements Action {
  readonly type = PersonActionTypes.Delete;

  constructor(public payload: string) {}
}
export class EditPersonAction implements Action {
  readonly type = PersonActionTypes.Edit;

  constructor(public payload: PersonEntry) {}
}
export class CreatePersonAction implements Action {
  readonly type = PersonActionTypes.Create;

  constructor(public payload: string) {}
}
