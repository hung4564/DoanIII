import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SelectionState } from '@alfresco/adf-extensions';
import { ContentManagementService } from 'app/services/content-management.service';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { getAppSelection } from 'app/store/selectors/app.selector';

@Component({
  selector: 'app-toggle-favorite-library',
  template: `
    <button
      mat-menu-item
      #favoriteLibrary="favoriteLibrary"
      (toggle)="onToggleEvent()"
      [acaFavoriteLibrary]="(selection$ | async).library"
      [attr.title]="
        favoriteLibrary.isFavorite()
          ? ('APP.ACTIONS.REMOVE_FAVORITE' | translate)
          : ('APP.ACTIONS.FAVORITE' | translate)
      "
    >
      <mat-icon *ngIf="favoriteLibrary.isFavorite()">star</mat-icon>
      <mat-icon *ngIf="!favoriteLibrary.isFavorite()">star_border</mat-icon>
      <span>{{
        (favoriteLibrary.isFavorite() ? "APP.ACTIONS.REMOVE_FAVORITE" : "APP.ACTIONS.FAVORITE")
          | translate
      }}</span>
    </button>
  `,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toggle-favorite-library' }
})
export class ToggleFavoriteLibraryComponent implements OnInit {
  selection$: Observable<SelectionState>;

  constructor(
    private store: Store<any>,
    private content: ContentManagementService,
    private router: Router
  ) {}

  ngOnInit() {
    const isFavoriteLibraries = this.router.url.startsWith('/favorite/libraries');

    this.selection$ = this.store.select(getAppSelection).pipe(
      distinctUntilChanged(),
      map(selection => {
        // favorite libraries list should already be marked as favorite
        if (selection.library && isFavoriteLibraries) {
          (<any>selection.library).isFavorite = true;
          return selection;
        }
        return selection;
      })
    );
  }

  onToggleEvent() {
    this.content.favoriteLibraryToggle.next();
  }
}
