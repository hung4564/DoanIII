import { MinimalNodeEntryEntity } from '@alfresco/js-api';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { SnackbarErrorAction } from 'app/store/actions/snackbar.actions';

@Component({
  templateUrl: './node-versions.dialog.html',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-node-versions-dialog' }
})
export class NodeVersionsDialogComponent {
  node: MinimalNodeEntryEntity;

  constructor(@Inject(MAT_DIALOG_DATA) data: any, private store: Store<any>) {
    this.node = data.node;
  }

  uploadError(errorMessage: string) {
    this.store.dispatch(new SnackbarErrorAction(errorMessage));
  }
}
