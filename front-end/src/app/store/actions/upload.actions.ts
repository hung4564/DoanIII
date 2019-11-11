import { Action } from '@ngrx/store';

export enum UploadActionTypes {
  UploadFiles = 'UPLOAD_FILES',
  UploadFolder = 'UPLOAD_FOLDER',
  UploadFileVersion = 'UPLOAD_FILE_VERSION'
}

export class UploadFilesAction implements Action {
  readonly type = UploadActionTypes.UploadFiles;

  constructor(public payload: any) {}
}

export class UploadFolderAction implements Action {
  readonly type = UploadActionTypes.UploadFolder;

  constructor(public payload: any) {}
}

export class UploadFileVersionAction implements Action {
  readonly type = UploadActionTypes.UploadFileVersion;
}
