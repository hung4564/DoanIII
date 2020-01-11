import { GroupEntry } from "@alfresco/js-api";
import { Action } from "@ngrx/store";
export enum GroupActionTypes {
  GetData = "GET_DATA_GROUP",
  Delete = "DELETE_GROUP",
  Create = "CREATE_GROUP",
  Edit = "EDIT_GROUP"
}
export class GetDataGroupAction implements Action {
  readonly type = GroupActionTypes.GetData;

  constructor(public payload: { filter: any }) {}
}
export class DeleteGroupAction implements Action {
  readonly type = GroupActionTypes.Delete;

  constructor(public payload: string) {}
}
export class EditGroupAction implements Action {
  readonly type = GroupActionTypes.Edit;

  constructor(public payload: GroupEntry) {}
}
export class CreateGroupAction implements Action {
  readonly type = GroupActionTypes.Create;

  constructor(public payload: string) {}
}
