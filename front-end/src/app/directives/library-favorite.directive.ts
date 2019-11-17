import {
  Directive,
  HostListener,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { SiteBody, FavoriteBody, FavoriteEntry, Site } from '@alfresco/js-api';
import { AlfrescoApiService } from '@alfresco/adf-core';

interface LibraryEntity {
  entry: Site;
  isLibrary: boolean;
  isFavorite: boolean;
}

@Directive({
  selector: '[appFavoriteLibrary]',
  exportAs: 'favoriteLibrary'
})
export class LibraryFavoriteDirective implements OnChanges {
  @Input('appFavoriteLibrary')
  library: any = null;

  @Output() toggle: EventEmitter<any> = new EventEmitter();
  @Output() error: EventEmitter<any> = new EventEmitter();

  private targetLibrary = null;

  @HostListener('click')
  onClick() {
    this.toggleFavorite();
  }

  constructor(private alfrescoApiService: AlfrescoApiService) {}

  ngOnChanges(changes) {
    if (!changes.library.currentValue) {
      this.targetLibrary = null;
      return;
    }

    this.targetLibrary = changes.library.currentValue;
    this.markFavoriteLibrary(changes.library.currentValue);
  }

  isFavorite() {
    return this.targetLibrary && this.targetLibrary.isFavorite;
  }

  toggleFavorite() {
    if (this.targetLibrary.isFavorite) {
      this.removeFavorite(this.targetLibrary.entry.guid);
    } else {
      const favoriteBody = this.createFavoriteBody(this.targetLibrary);
      this.addFavorite(favoriteBody);
    }
  }

  private async markFavoriteLibrary(library: LibraryEntity) {
    if (this.targetLibrary.isFavorite === undefined) {
      await this.getFavoriteSite(library);
    } else {
      this.targetLibrary = library;
    }
  }

  private getFavoriteSite(library: LibraryEntity) {
    this.alfrescoApiService.peopleApi
      .getFavoriteSite('-me-', library.entry.id)
      .then(() => (this.targetLibrary.isFavorite = true))
      .catch(() => (this.targetLibrary.isFavorite = false));
  }

  private createFavoriteBody(library: LibraryEntity): FavoriteBody {
    return {
      target: {
        site: {
          guid: library.entry.guid
        }
      }
    };
  }

  private addFavorite(favoriteBody: FavoriteBody) {
    this.alfrescoApiService.peopleApi
      .addFavorite('-me-', favoriteBody)
      .then((libraryEntry: FavoriteEntry) => {
        this.targetLibrary.isFavorite = true;
        this.toggle.emit(libraryEntry);
      })
      .catch(error => this.error.emit(error));
  }

  private removeFavorite(favoriteId: string) {
    this.alfrescoApiService.favoritesApi
      .removeFavoriteSite('-me-', favoriteId)
      .then((libraryBody: SiteBody) => {
        this.targetLibrary.isFavorite = false;
        this.toggle.emit(libraryBody);
      })
      .catch(error => this.error.emit(error));
  }
}
