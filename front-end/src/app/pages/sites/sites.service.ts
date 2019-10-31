import { Injectable } from '@angular/core';
import { AlfrescoApiService, TranslationService } from '@alfresco/adf-core';
import { Observable } from 'rxjs';
import { SitePaging, SiteEntry, Site, SiteBodyCreate } from '@alfresco/js-api';
import { HandleService } from 'app/services/api.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SitesService {
  get sitesApi() {
    return this.apiService.sitesApi;
  }
  constructor(
    private apiService: AlfrescoApiService,
    private handleService: HandleService,
    private _transSV: TranslationService
  ) {}
  createForm(data: Site): FormGroup {
    return new FormGroup({
      id: new FormControl(data.id, [Validators.required]),
      title: new FormControl(data.title, [Validators.required]),
      description: new FormControl(data.description),
      visibility: new FormControl(data.visibility, [Validators.required])
    });
  }
  formatItem(item: Site) {
    return item;
  }
  getSites(opts): Observable<SitePaging> {
    return new Observable(observer => {
      this.sitesApi.getSites(opts).then(
        result => {
          observer.next(result);
          observer.complete();
        },
        e => {
          observer.error(e);
        }
      );
    });
  }
  createSite(data: SiteBodyCreate) {
    const createtrans: string = this._transSV.instant('APP.ACTIONS.CREATE');
    const confirmtrans = this._transSV.instant('APP.DIALOGS.CONFIRM_ACTION_GROUP', {
      action: createtrans.toLowerCase()
    });
    return new Observable(observer => {
      this.handleService
        .confirm({ title: createtrans, message: confirmtrans })
        .subscribe(isCreate => {
          if (isCreate) {
            this.sitesApi.createSite(data).then(
              result => {
                observer.next(result);
                observer.complete();
              },
              e => {
                observer.error(e);
              }
            );
          } else {
            observer.complete();
          }
        });
    });
  }
}
