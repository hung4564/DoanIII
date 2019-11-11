import { Component, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppStore } from 'app/store';
import { ContentManagementService } from 'app/services/content-management.service';
import { ToggleJoinLibraryButtonComponent } from './toggle-join-library-button.component';

@Component({
  selector: 'app-toggle-join-library-menu',
  template: `
    <button
      mat-menu-item
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
      <span>{{
        (membership.isJoinRequested | async)
          ? ("APP.ACTIONS.CANCEL_JOIN" | translate)
          : ("APP.ACTIONS.JOIN" | translate)
      }}</span>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toggle-join-library' }
})
export class ToggleJoinLibraryMenuComponent extends ToggleJoinLibraryButtonComponent {
  constructor(store: Store<AppStore>, content: ContentManagementService) {
    super(store, content);
  }
}
