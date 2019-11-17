import { AlfrescoApiService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { SitePaging } from '@alfresco/js-api';
import { Subject } from 'rxjs';

export interface LibrarySearchQuery {
  term: string;
  opts: {
    skipCount: number;
    maxItems: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SearchLibrariesQueryBuilderService {
  private _userQuery = '';

  updated: Subject<any> = new Subject();
  executed: Subject<any> = new Subject();
  hadError: Subject<any> = new Subject();

  paging: { maxItems?: number; skipCount?: number } = null;

  get userQuery(): string {
    return this._userQuery;
  }

  set userQuery(value: string) {
    this._userQuery = value ? value.trim() : '';
  }

  constructor(private alfrescoApiService: AlfrescoApiService) {}

  update(): void {
    const query = this.buildQuery();
    if (query) {
      this.updated.next(query);
    }
  }

  async execute() {
    const query = this.buildQuery();
    if (query) {
      const data = await this.findLibraries(query);
      this.executed.next(data);
    }
  }

  buildQuery(): LibrarySearchQuery {
    const query = this.userQuery;
    if (query && query.length > 1) {
      const resultQuery = {
        term: query,
        opts: {
          skipCount: this.paging && this.paging.skipCount,
          maxItems: this.paging && this.paging.maxItems
        }
      };
      return resultQuery;
    }
    return null;
  }

  private findLibraries(libraryQuery: LibrarySearchQuery): Promise<SitePaging> {
    return this.alfrescoApiService
      .getInstance()
      .core.queriesApi.findSites(libraryQuery.term, libraryQuery.opts)
      .catch(err => {
        this.hadError.next(err);
        return { list: { pagination: { totalItems: 0 }, entries: [] } };
      });
  }
}
