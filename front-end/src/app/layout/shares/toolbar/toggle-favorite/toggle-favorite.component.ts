import { Component, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SelectionState } from '@alfresco/adf-extensions';
import {
  AppStore,
  ReloadDocumentListAction,
  getAppSelection
} from 'app/store';

@Component({
  selector: 'app-toggle-favorite',
  template: `
    <button
      mat-menu-item
      #favorites="adfFavorite"
      (toggle)="onToggleEvent()"
      [adf-node-favorite]="(selection$ | async).nodes"
    >
      <mat-icon *ngIf="favorites.hasFavorites()">star</mat-icon>
      <mat-icon *ngIf="!favorites.hasFavorites()">star_border</mat-icon>
      <span>{{
        (favorites.hasFavorites()
          ? 'APP.ACTIONS.REMOVE_FAVORITE'
          : 'APP.ACTIONS.FAVORITE') | translate
      }}</span>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toggle-favorite' }
})
export class ToggleFavoriteComponent {
  selection$: Observable<SelectionState>;

  constructor(private store: Store<AppStore>) {
    this.selection$ = this.store.select(getAppSelection);
  }

  onToggleEvent() {
    this.store.dispatch(new ReloadDocumentListAction());
  }
}
