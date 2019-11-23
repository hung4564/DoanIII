import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import {
  MinimalNodeEntity,
  SiteEntry,
  SiteContainerPaging,
  SiteContainerEntry
} from "@alfresco/js-api";
import { ContentApiService } from "app/services/content-api.service";
import { shareReplay } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class LibraryService {
  changeFolderInSite = new Subject<MinimalNodeEntity>();
  changeFolderInBreadcrumb = new Subject<string>();
  get siteId() {
    return this._siteId;
  }
  private _siteId: string;
  private getSite$: Observable<SiteAndContainers>;
  constructor(private contentApi: ContentApiService) {}
  getSite(siteId: string, opts?: any) {
    if (!this.getSite$) {
      opts = { ...opts, relations: ["containers"] };
      this.getSite$ = this.contentApi
        .getSite(siteId, opts)
        .pipe(shareReplay(1)) as Observable<SiteAndContainers>;
    }
    return this.getSite$;
  }
  setSiteId(id: string) {
    this._siteId = id;
    this.getSite$ = null;
  }
  getNodeOfDocumentLibrary(site: SiteAndContainers): SiteContainerEntry {
    const found = site.relations.containers.list.entries.find(
      x => x.entry.folderId == "documentLibrary"
    );
    return found;
  }
  getSiteMember(opts: any) {
    return this.contentApi.getSiteMember(this._siteId, opts);
  }
  getSiteMemberRequest(opts: any) {
    return this.contentApi.getSiteMemberRequest(this._siteId, opts);
  }
}
interface SiteAndContainers extends SiteEntry {
  relations: { containers: SiteContainerPaging };
}
