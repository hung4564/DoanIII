import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { MinimalNodeEntryEntity, PathInfoEntity } from '@alfresco/js-api';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppStore } from '../states/app.state';
import {
  NavigateUrlAction,
  RouterActionTypes,
  NavigateRouteAction,
  NavigateToFolder,
  NavigateToParentFolder
} from '..';
import { SnackbarErrorAction } from '..';

@Injectable()
export class RouterEffects {
  constructor(private store: Store<AppStore>, private actions$: Actions, private router: Router) {}

  @Effect({ dispatch: false })
  navigateUrl$ = this.actions$.pipe(
    ofType<NavigateUrlAction>(RouterActionTypes.NavigateUrl),
    map(action => {
      if (action.payload) {
        this.router.navigateByUrl(action.payload);
      }
    })
  );

  @Effect({ dispatch: false })
  navigateRoute$ = this.actions$.pipe(
    ofType<NavigateRouteAction>(RouterActionTypes.NavigateRoute),
    map(action => {
      this.router.navigate(action.payload);
    })
  );

  @Effect({ dispatch: false })
  navigateToFolder$ = this.actions$.pipe(
    ofType<NavigateToFolder>(RouterActionTypes.NavigateFolder),
    map(action => {
      if (action.payload && action.payload.entry) {
        this.navigateToFolder(action.payload.entry);
      }
    })
  );

  @Effect({ dispatch: false })
  navigateToParentFolder$ = this.actions$.pipe(
    ofType<NavigateToParentFolder>(RouterActionTypes.NavigateParentFolder),
    map(action => {
      if (action.payload && action.payload.entry) {
        this.navigateToParentFolder(action.payload.entry);
      }
    })
  );

  private navigateToFolder(node: MinimalNodeEntryEntity) {
    let link: any[] = null;
    const { path, id } = node;

    if (path && path.name && path.elements) {
      const isLibraryPath = this.isLibraryContent(<PathInfoEntity>path);

      const parent = path.elements[path.elements.length - 1];
      const area = isLibraryPath ? '/libraries' : '/personal-files';

      if (!isLibraryPath) {
        link = [area, id];
      } else {
        // parent.id could be 'Site' folder or child as 'documentLibrary'
        link = [area, parent.name === 'Sites' ? {} : id];
      }

      setTimeout(() => {
        this.router.navigate(link);
      }, 10);
    } else {
      this.router.navigate(['/personal-files', node.id]);
    }
  }

  private navigateToParentFolder(node: MinimalNodeEntryEntity) {
    let link: any[] = null;
    const { path } = node;

    if (path && path.name && path.elements) {
      const isLibraryPath = this.isLibraryContent(<PathInfoEntity>path);

      const parent = path.elements[path.elements.length - 1];
      const area = isLibraryPath ? '/libraries' : '/personal-files';

      if (!isLibraryPath) {
        link = [area, parent.id];
      } else {
        // parent.id could be 'Site' folder or child as 'documentLibrary'
        link = [area, parent.name === 'Sites' ? {} : parent.id];
      }

      setTimeout(() => {
        this.router.navigate(link);
      }, 10);
    } else {
      this.store.dispatch(new SnackbarErrorAction('APP.MESSAGES.ERRORS.CANNOT_NAVIGATE_LOCATION'));
    }
  }

  private isLibraryContent(path: PathInfoEntity): boolean {
    if (path && path.elements.length >= 2 && path.elements[1].name === 'Sites') {
      return true;
    }

    return false;
  }
}
