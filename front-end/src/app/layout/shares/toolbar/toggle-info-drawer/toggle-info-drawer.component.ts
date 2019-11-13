import { Component, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { isInfoDrawerOpened } from 'app/store/selectors/app.selector';
import { ToggleInfoDrawerAction } from 'app/store/actions/app.action';


@Component({
  selector: 'app-toggle-info-drawer',
  template: `
    <button
      mat-icon-button
      [color]="(infoDrawerOpened$ | async) ? 'primary' : ''"
      [attr.title]="'APP.ACTIONS.DETAILS' | translate"
      (click)="onClick()"
    >
      <mat-icon>info_outline</mat-icon>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toggle-info-drawer' }
})
export class ToggleInfoDrawerComponent {
  infoDrawerOpened$: Observable<boolean>;

  constructor(private store: Store<any>) {
    this.infoDrawerOpened$ = this.store.select(isInfoDrawerOpened);
  }

  onClick() {
    this.store.dispatch(new ToggleInfoDrawerAction());
  }
}
