import { Effect, Actions, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { Router, UrlTree, UrlSegmentGroup, PRIMARY_OUTLET, UrlSegment } from '@angular/router';
import { Store, createSelector } from '@ngrx/store';
import { getAppSelection, getCurrentFolder } from '../selectors/app.selector';
import { AppStore } from '../states/app.state';
import {
  FullscreenViewerAction,
  ViewerActionTypes,
  ViewNodeAction,
  ViewFileAction
} from '../actions/viewer.actions';
import { AppExtensionService } from 'app/extensions/app-extension.service';

export const fileToPreview = createSelector(
  getAppSelection,
  getCurrentFolder,
  (selection, folder) => {
    return {
      selection,
      folder
    };
  }
);

@Injectable()
export class ViewerEffects {
  constructor(
    private store: Store<any>,
    private actions$: Actions,
    private router: Router,
    private extensions: AppExtensionService
  ) {}

  @Effect({ dispatch: false })
  fullscreenViewer$ = this.actions$.pipe(
    ofType<FullscreenViewerAction>(ViewerActionTypes.FullScreen),
    map(() => {
      this.enterFullScreen();
    })
  );

  @Effect({ dispatch: false })
  viewNode$ = this.actions$.pipe(
    ofType<ViewNodeAction>(ViewerActionTypes.ViewNode),
    map(action => {
      if (action.viewNodeExtras) {
        const { location, path } = action.viewNodeExtras;

        if (location) {
          this.router.navigate([location, { outlets: { overlay: ['view', action.nodeId] } }], {
            queryParams: {
              source: location
            }
          });
        }

        if (path) {
          this.router.navigate(['view', { outlets: { overlay: [action.nodeId] } }], {
            queryParams: { path }
          });
        }
      } else {
        this.router.navigate([{ outlets: { overlay: ['files', action.nodeId, 'view'] } }]);
      }
    })
  );

  @Effect({ dispatch: false })
  viewFile$ = this.actions$.pipe(
    ofType<ViewFileAction>(ViewerActionTypes.ViewFile),
    map(action => {
      if (action.payload && action.payload.entry) {
        const { id, nodeId, isFile } = <any>action.payload.entry;

        const isCanView = (isFile || nodeId) && this.extensions.canPreviewNode(action.payload);
        if (isCanView) {
          this.displayPreview(nodeId || id, action.parentId);
        }
      } else {
        this.store
          .select(fileToPreview)
          .pipe(take(1))
          .subscribe(result => {
            if (result.selection && result.selection.file) {
              const { id, nodeId, isFile } = <any>result.selection.file.entry;

              const isCanView =
                (isFile || nodeId) && this.extensions.canPreviewNode(action.payload);
              if (isCanView) {
                const parentId = result.folder ? result.folder.id : null;
                this.displayPreview(nodeId || id, parentId);
              }
            }
          });
      }
    })
  );

  private displayPreview(nodeId: string, parentId: string) {
    if (!nodeId) {
      return;
    }

    let previewLocation = this.router.url;
    if (previewLocation.lastIndexOf('/') > 0) {
      previewLocation = previewLocation.substr(0, this.router.url.indexOf('/', 1));
    }
    previewLocation = previewLocation.replace(/\//g, '');

    const path = [previewLocation];
    if (parentId) {
      path.push(parentId);
    }
    path.push('preview', nodeId);
    this.router.navigateByUrl(path.join('/'));
  }

  enterFullScreen() {
    const container = <any>(
      document.documentElement.querySelector('.adf-viewer__fullscreen-container')
    );
    if (container) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
    }
  }
}
