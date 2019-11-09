import { Action } from '@ngrx/store';
import { MinimalNodeEntity } from '@alfresco/js-api';

export enum ViewerActionTypes {
  ViewFile = 'VIEW_FILE',
  ViewNode = 'VIEW_NODE',
  FullScreen = 'FULLSCREEN_VIEWER',
  ClosePreview = 'CLOSE_PREVIEW'
}

export interface ViewNodeExtras {
  location?: string;
  path?: string;
}

export class ViewFileAction implements Action {
  readonly type = ViewerActionTypes.ViewFile;

  constructor(public payload?: MinimalNodeEntity, public parentId?: string) {}
}

export class ViewNodeAction implements Action {
  readonly type = ViewerActionTypes.ViewNode;

  constructor(public nodeId: string, public viewNodeExtras?: ViewNodeExtras) {}
}

export class FullscreenViewerAction implements Action {
  readonly type = ViewerActionTypes.FullScreen;

  constructor(public payload: MinimalNodeEntity) {}
}

export class ClosePreviewAction implements Action {
  readonly type = ViewerActionTypes.ClosePreview;
  constructor(public payload?: MinimalNodeEntity) {}
}
