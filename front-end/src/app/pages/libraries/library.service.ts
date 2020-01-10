import {
  MinimalNodeEntity,
  SiteContainerEntry,
  SiteContainerPaging,
  SiteEntry
} from "@alfresco/js-api";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CustomSite } from "app/model/custom-site.model";
import { ContentApiService } from "app/services/content-api.service";
import { Observable, Subject } from "rxjs";
import { map, shareReplay } from "rxjs/operators";

@Injectable()
export class LibraryService {
  changeFolderInSite = new Subject<MinimalNodeEntity>();
  changeFolderInBreadcrumb = new Subject<string>();
  get siteId() {
    return this._siteId;
  }
  private _siteId: string;
  private getSite$: Observable<SiteAndContainers>;
  constructor(private contentApi: ContentApiService, private router: Router) {}
  getSite(opts?: any) {
    if (!this.siteId) {
      this.router.navigate(["./", "libraries"]);
    }
    if (!this.getSite$) {
      opts = { ...opts, relations: ["containers"] };
      this.getSite$ = (this.contentApi.getSite(this.siteId, opts) as Observable<
        SiteAndContainers
      >).pipe(
        shareReplay(1),
        map(site => {
          const found = this.getApproveFolder(
            site.relations.containers.list.entries
          );
          const document = this.getNodeOfDocumentLibrary(site);
          site.entry.nodeIdFolderDocument = document.entry.id;
          site.entry.isApprove = !!found;
          site.entry.nodeIdFolerApprove = found ? found.entry.id : "";
          return site;
        })
      );
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
  getApproveFolder(containers: SiteContainerEntry[]): SiteContainerEntry {
    const found = containers.find(
      x => x.entry.folderId == "needApproveDocumentLibrary"
    );
    return found;
  }
  getSiteMember(opts: any) {
    return this.contentApi.getSiteMember(this._siteId, opts);
  }
  getSiteMemberRequest(opts: any) {
    return this.contentApi.getSiteMemberRequest(this._siteId, opts);
  }
  createSiteApproveFolder() {
    this;
  }
}
interface SiteAndContainers extends SiteEntry {
  entry: CustomSite;
  relations: { containers: SiteContainerPaging };
}
