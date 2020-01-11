import {
  MinimalNodeEntity,
  MinimalNodeEntryEntity,
  PathElementEntity,
  PathInfo
} from "@alfresco/js-api";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppExtensionService } from "app/extensions/app-extension.service";
import { ContentApiService } from "app/services/content-api.service";
import { ContentManagementService } from "app/services/content-management.service";
import { map } from "rxjs/operators";
import { PageComponent } from "../page.component";

@Component({
  selector: "app-file-favorite",
  templateUrl: "./file-favorite.component.html",
  styleUrls: ["./file-favorite.component.scss"],
  host: { class: "app-layout" }
})
export class FileFavoriteComponent extends PageComponent implements OnInit {
  columns: any[] = [];
  constructor(
    private router: Router,
    store: Store<any>,
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

    const isSitePath = (path: PathInfo): boolean => {
      return (
        path &&
        path.elements &&
        path.elements.some(({ name }: PathElementEntity) => name === "Sites")
      );
    };

    if (isFolder) {
      this.contentApi
        .getNode(id)
        .pipe(map(node => node.entry))
        .subscribe(({ path }: MinimalNodeEntryEntity) => {
          const routeUrl = isSitePath(path) ? "/libraries" : "/personal-files";
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
