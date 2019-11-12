import { MinimalNodeEntity } from '@alfresco/js-api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { getAppSelection } from 'app/store/selectors/app.selector';
import { DownloadNodesAction, EditOfflineAction } from 'app/store/actions/node.action';
import { SnackbarErrorAction } from 'app/store/actions/snackbar.actions';

@Component({
  selector: 'app-toggle-edit-offline',
  template: `
    <button
      #lock="lockNode"
      mat-menu-item
      (toggle)="onToggleEvent($event)"
      (lockError)="onLockError()"
      (unlockError)="onUnlockLockError()"
      [acaLockNode]="selection"
      [attr.title]="
        lock.isNodeLocked()
          ? ('APP.ACTIONS.EDIT_OFFLINE_CANCEL' | translate)
          : ('APP.ACTIONS.EDIT_OFFLINE' | translate)
      "
    >
      <ng-container *ngIf="lock.isNodeLocked()">
        <mat-icon>cancel</mat-icon>
        <span>{{ 'APP.ACTIONS.EDIT_OFFLINE_CANCEL' | translate }}</span>
      </ng-container>

      <ng-container *ngIf="!lock.isNodeLocked()">
        <mat-icon>edit</mat-icon>
        <span>{{ 'APP.ACTIONS.EDIT_OFFLINE' | translate }}</span>
      </ng-container>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toggle-edit-offline' }
})
export class ToggleEditOfflineComponent implements OnInit {
  selection: MinimalNodeEntity;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.store.select(getAppSelection).subscribe(({ file }) => {
      this.selection = file;
    });
  }

  onToggleEvent(isNodeLocked: boolean) {
    if (isNodeLocked) {
      this.store.dispatch(new DownloadNodesAction([this.selection]));
    }
    this.store.dispatch(new EditOfflineAction(this.selection));
  }

  onLockError() {
    this.store.dispatch(
      new SnackbarErrorAction('APP.MESSAGES.ERRORS.LOCK_NODE', {
        fileName: this.selection.entry.name
      })
    );
  }

  onUnlockLockError() {
    this.store.dispatch(
      new SnackbarErrorAction('APP.MESSAGES.ERRORS.UNLOCK_NODE', {
        fileName: this.selection.entry.name
      })
    );
  }
}
