import {
  AppStore,
  SnackbarErrorAction,
  UnlockWriteAction,
  UploadActionTypes,
  UploadFilesAction,
  UploadFileVersionAction,
  UploadFolderAction,
  getCurrentFolder
} from '..';
import { FileModel, FileUtils, UploadService } from '@alfresco/adf-core';
import { Injectable, NgZone, RendererFactory2 } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, of } from 'rxjs';
import { tap, filter, catchError, flatMap, map, take } from 'rxjs/operators';
import { ContentManagementService } from '../../services/content-management.service';

@Injectable()
export class UploadEffects {
  private fileInput: HTMLInputElement;
  private folderInput: HTMLInputElement;
  private fileVersionInput: HTMLInputElement;

  constructor(
    private store: Store<AppStore>,
    private actions$: Actions,
    private ngZone: NgZone,
    private uploadService: UploadService,
    rendererFactory: RendererFactory2,
    private contentService: ContentManagementService
  ) {
    const renderer = rendererFactory.createRenderer(null, null);

    this.fileInput = renderer.createElement('input') as HTMLInputElement;
    this.fileInput.id = 'app-upload-files';
    this.fileInput.type = 'file';
    this.fileInput.style.display = 'none';
    this.fileInput.setAttribute('multiple', '');
    this.fileInput.addEventListener('change', event => this.upload(event));
    renderer.appendChild(document.body, this.fileInput);

    this.fileVersionInput = renderer.createElement('input') as HTMLInputElement;
    this.fileVersionInput.id = 'app-upload-file-version';
    this.fileVersionInput.type = 'file';
    this.fileVersionInput.style.display = 'none';
    this.fileVersionInput.addEventListener('change', () => this.uploadVersion());
    renderer.appendChild(document.body, this.fileVersionInput);

    this.folderInput = renderer.createElement('input') as HTMLInputElement;
    this.folderInput.id = 'app-upload-folder';
    this.folderInput.type = 'file';
    this.folderInput.style.display = 'none';
    this.folderInput.setAttribute('directory', '');
    this.folderInput.setAttribute('webkitdirectory', '');
    this.folderInput.addEventListener('change', event => this.upload(event));
    renderer.appendChild(document.body, this.folderInput);
  }

  @Effect({ dispatch: false })
  uploadFiles$ = this.actions$.pipe(
    ofType<UploadFilesAction>(UploadActionTypes.UploadFiles),
    map(() => {
      this.fileInput.click();
    })
  );

  @Effect({ dispatch: false })
  uploadFolder$ = this.actions$.pipe(
    ofType<UploadFolderAction>(UploadActionTypes.UploadFolder),
    map(() => {
      this.folderInput.click();
    })
  );

  @Effect({ dispatch: false })
  uploadVersion$ = this.actions$.pipe(
    ofType<UploadFileVersionAction>(UploadActionTypes.UploadFileVersion),
    map(() => {
      this.fileVersionInput.click();
    })
  );

  private uploadVersion() {
    this.contentService
      .versionUploadDialog()
      .afterClosed()
      .pipe(
        tap(form => {
          if (!form) {
            this.fileVersionInput.value = '';
          }
        }),
        filter(form => !!form),
        flatMap(form =>
          forkJoin(
            of(form),
            this.contentService.getNodeInfo().pipe(
              catchError(_ => {
                this.store.dispatch(new SnackbarErrorAction('VERSION.ERROR.GENERIC'));
                return of(null);
              })
            )
          )
        )
      )
      .subscribe(([form, node]) => {
        if (form && node) {
          const file = this.fileVersionInput.files[0];
          const fileModel = new FileModel(
            file,
            {
              comment: form.comment,
              majorVersion: form.version,
              parentId: node.parentId,
              path: ((<any>file).webkitRelativePath || '').replace(/\/[^\/]*$/, ''),
              newVersion: true,
              nodeType: 'cm:content'
            },
            node.id
          );
          this.uploadAndUnlock(fileModel);
        }

        this.fileVersionInput.value = '';
      });
  }

  private upload(event: any): void {
    this.store
      .select(getCurrentFolder)
      .pipe(take(1))
      .subscribe(node => {
        if (node && node.id) {
          const input = <HTMLInputElement>event.currentTarget;
          const files = FileUtils.toFileArray(input.files).map(file => {
            return new FileModel(file, {
              parentId: node.id,
              path: ((<any>file).webkitRelativePath || '').replace(/\/[^\/]*$/, ''),
              nodeType: 'cm:content'
            });
          });

          this.uploadQueue(files);
          event.target.value = '';
        }
      });
  }

  private uploadQueue(files: FileModel[]) {
    if (files.length > 0) {
      this.ngZone.run(() => {
        this.uploadService.addToQueue(...files);
        this.uploadService.uploadFilesInTheQueue();
      });
    }
  }

  uploadAndUnlock(file: FileModel) {
    if (!file) {
      return;
    }

    this.ngZone.run(() => {
      this.uploadService.addToQueue(file);
      this.uploadService.uploadFilesInTheQueue();

      const subscription = this.uploadService.fileUploadComplete.subscribe(completed => {
        if (
          file.data &&
          file.data.entry &&
          file.data.entry.properties &&
          file.data.entry.properties['cm:lockType'] === 'WRITE_LOCK' &&
          file.data.entry.id === completed.data.entry.id
        ) {
          this.store.dispatch(new UnlockWriteAction(completed.data));
        }

        subscription.unsubscribe();
      });
    });
  }
}
