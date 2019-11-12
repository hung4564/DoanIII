import { Component, OnInit } from '@angular/core';
import { PageComponent } from '../page.component';
import { AppExtensionService } from 'app/extensions/app-extension.service';
import { ContentManagementService } from 'app/services/content-management.service';
import { Router } from '@angular/router';
import { AppStore } from 'app/store';
import { Store } from '@ngrx/store';
import { MinimalNodeEntity, MinimalNodeEntryEntity, PathInfo, PathElementEntity } from '@alfresco/js-api';
import { ContentApiService } from 'app/services/content-api.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-file-favorite',
  templateUrl: './file-favorite.component.html',
  styleUrls: ['./file-favorite.component.scss'],
  host: { class: 'app-layout' }
})
export class FileFavoriteComponent extends PageComponent implements OnInit {
  columns: any[] = [];
  constructor(
    private router: Router,
    store: Store<AppStore>,
    extensions: AppExtensionService,
    content: ContentManagementService,
    private contentApi: ContentApiService
  ) {
    super(store, extensions, content);
  }

  ngOnInit() {
    super.ngOnInit();
    this.columns = this.extensions.documentListPresets.favorites;
  }
  navigate(favorite: MinimalNodeEntryEntity) {
    const { isFolder, id } = favorite;

    // TODO: rework as it will fail on non-English setups
    const isSitePath = (path: PathInfo): boolean => {
      return (
        path &&
        path.elements &&
        path.elements.some(({ name }: PathElementEntity) => name === 'Sites')
      );
    };

    if (isFolder) {
      this.contentApi
        .getNode(id)
        .pipe(map(node => node.entry))
        .subscribe(({ path }: MinimalNodeEntryEntity) => {
          const routeUrl = isSitePath(path) ? '/libraries' : '/personal-files';
          this.router.navigate([routeUrl, id]);
        });
    }
  }

  onNodeDoubleClick(node: MinimalNodeEntity) {
    if (node && node.entry) {
      if (node.entry.isFolder) {
        this.navigate(node.entry);
      }

      if (node.entry.isFile) {
        this.showPreview(node);
      }
    }
  }
}
