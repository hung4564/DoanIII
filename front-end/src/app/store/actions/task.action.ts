import { Action } from "@ngrx/store";
import { TaskEntry } from "app/model";
export enum TaskActionTypes {
  Delete = "DELETE_TASK",
  Create = "CREATE_TASK",
  Edit = "EDIT_TASK",
  ChangeFormTask = "SELECT_FORM_TASK"
}
export class DeleteTaskAction implements Action {
  readonly type = TaskActionTypes.Delete;

  constructor(public payload: string) {}
}
export class EditTaskAction implements Action {
  readonly type = TaskActionTypes.Edit;

  constructor(public payload: TaskEntry) {}
}
export class CreateTaskAction implements Action {
  readonly type = TaskActionTypes.Create;

  constructor(public payload: string) {}
}
export class ChangeFormTaskAction implements Action {
  readonly type = TaskActionTypes.ChangeFormTask;

  constructor(public payload: string) {}
}
