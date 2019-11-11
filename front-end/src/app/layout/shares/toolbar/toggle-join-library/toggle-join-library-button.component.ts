import {
  AppStore,
  SetSelectedNodesAction,
  SnackbarErrorAction,
  SnackbarInfoAction,
  getAppSelection
} from 'app/store';
import { SelectionState } from '@alfresco/adf-extensions';
import { Component, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  LibraryMembershipErrorEvent,
  LibraryMembershipToggleEvent
} from 'app/directives/library-membership.directive';
import { ContentManagementService } from 'app/services/content-management.service';

@Component({
  selector: 'app-toggle-join-library-button',
  template: `
    <button
      mat-icon-button
      color="primary"
      #membership="libraryMembership"
      (toggle)="onToggleEvent($event)"
      (error)="onErrorEvent($event)"
      [acaLibraryMembership]="(selection$ | async).library"
      [attr.title]="
        (membership.isJoinRequested | async)
          ? ('APP.ACTIONS.CANCEL_JOIN' | translate)
          : ('APP.ACTIONS.JOIN' | translate)
      "
    >
      <mat-icon *ngIf="membership.isJoinRequested | async">cancel</mat-icon>
      <mat-icon *ngIf="!(membership.isJoinRequested | async)" svgIcon="adf:join_library"></mat-icon>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toggle-join-library' }
})
export class ToggleJoinLibraryButtonComponent {
  selection$: Observable<SelectionState>;

  constructor(private store: Store<AppStore>, private content: ContentManagementService) {
    this.selection$ = this.store.select(getAppSelection);
  }

  onToggleEvent(event: LibraryMembershipToggleEvent) {
    this.store.dispatch(new SnackbarInfoAction(event.i18nKey));

    if (event.shouldReload) {
      this.content.libraryJoined.next();
    } else {
      if (event.updatedEntry) {
        this.store.dispatch(
          new SetSelectedNodesAction([<any>{ entry: event.updatedEntry, isLibrary: true }])
        );
      }
      this.content.joinLibraryToggle.next();
    }
  }

  onErrorEvent(event: LibraryMembershipErrorEvent) {
    this.store.dispatch(new SnackbarErrorAction(event.i18nKey));
  }
}
