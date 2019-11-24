import { Action } from "@ngrx/store";
import {
  SiteBody,
  SiteEntry,
  Site,
  SiteMemberEntry,
  SiteMembershipRequestWithPersonEntry,
  MinimalNodeEntity
} from "@alfresco/js-api";

export enum LibraryActionTypes {
  Delete = "DELETE_LIBRARY",
  Create = "CREATE_LIBRARY",
  Navigate = "NAVIGATE_LIBRARY",
  Update = "UPDATE_LIBRARY",
  Leave = "LEAVE_LIBRARY",
  AddMember = "ADD_LIBRARY_MEMBER",
  UpdateMember = "UPDATE_LIBRARY_MEMBER",
  DeleteMember = "REMOVE_LIBRARY_MEMBER",
  ApproveMember = "APPROVE_LIBRARY_MEMBER",
  RejectMember = "REJECT_LIBRARY_MEMBER",
  AddApproveFolder = "ADD_APPROVE_LIBRARY_FOLDER",
  DeleteApproveFolder = "DELETE_APPROVE_LIBRARY_FOLDER",
  ApproveLibraryNode = "APPROVE_LIBRARY_NODE",
  RejectLibraryNode = "REJECT_LIBRARY_NODE"
}

export class DeleteLibraryAction implements Action {
  readonly type = LibraryActionTypes.Delete;

  constructor(public payload?: string) {}
}

export class CreateLibraryAction implements Action {
  readonly type = LibraryActionTypes.Create;
}

export class NavigateLibraryAction implements Action {
  readonly type = LibraryActionTypes.Navigate;

  constructor(public payload?: SiteEntry) {}
}

export class UpdateLibraryAction implements Action {
  readonly type = LibraryActionTypes.Update;

  constructor(public payload?: SiteBody) {}
}

export class LeaveLibraryAction implements Action {
  readonly type = LibraryActionTypes.Leave;

  constructor(public payload?: string) {}
}
export class AddMemberLibraryAction implements Action {
  readonly type = LibraryActionTypes.AddMember;

  constructor(public payload?: string) {}
}
export class UpdateMemberLibraryAction implements Action {
  readonly type = LibraryActionTypes.UpdateMember;

  constructor(public payload?: { personId: string; role: Site.RoleEnum }) {}
}
export class DeleteMemberLibraryAction implements Action {
  readonly type = LibraryActionTypes.DeleteMember;

  constructor(public payload?: SiteMemberEntry) {}
}
export class ApproveMemberLibraryAction implements Action {
  readonly type = LibraryActionTypes.ApproveMember;

  constructor(public payload?: SiteMembershipRequestWithPersonEntry) {}
}
export class RejectMemberLibraryAction implements Action {
  readonly type = LibraryActionTypes.RejectMember;

  constructor(public payload?: SiteMembershipRequestWithPersonEntry) {}
}
export class AddApproveFolderAction implements Action {
  readonly type = LibraryActionTypes.AddApproveFolder;

  constructor(public payload?: Site) {}
}
export class DeleteApproveFolderAction implements Action {
  readonly type = LibraryActionTypes.DeleteApproveFolder;

  constructor(public payload?: string) {}
}
export class ApproveLibraryNodeAction implements Action {
  readonly type = LibraryActionTypes.ApproveLibraryNode;

  constructor(public payload?: MinimalNodeEntity) {}
}
export class RejectLibraryNodeAction implements Action {
  readonly type = LibraryActionTypes.RejectLibraryNode;

  constructor(public payload?: MinimalNodeEntity) {}
}
