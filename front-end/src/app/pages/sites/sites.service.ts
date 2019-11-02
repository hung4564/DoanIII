import { Injectable } from '@angular/core';
import { AlfrescoApiService, TranslationService } from '@alfresco/adf-core';
import { Observable } from 'rxjs';
import {
  SitePaging,
  SiteEntry,
  Site,
  SiteBodyCreate,
  SiteBodyUpdate,
  SiteMemberPaging,
  SiteMembershipBodyUpdate,
  SiteMembershipBodyCreate
} from '@alfresco/js-api';
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
    private handleSV: HandleService,
    private _transSV: TranslationService
  ) {}
  createForm(data: Site): FormGroup {
    if (!data.id) {
      data.visibility = Site.VisibilityEnum.PRIVATE;
    }
    return new FormGroup({
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
    const confirmtrans = this._transSV.instant('APP.DIALOGS.CONFIRM_ACTION_SITE', {
      action: createtrans.toLowerCase()
    });
    return new Observable(observer => {
      this.handleSV.confirm({ title: createtrans, message: confirmtrans }).subscribe(isCreate => {
        if (isCreate) {
          this.sitesApi.createSite(data).then(
            result => {
              this.handleSuccess('CREATE');
              observer.next(result);
              observer.complete();
            },
            e => {
              this.handleError(e);
              observer.error(e);
            }
          );
        } else {
          observer.complete();
        }
      });
    });
  }
  getSite(id: string): Observable<Site> {
    return new Observable(observable => {
      this.sitesApi.getSite(id).then(
        result => {
          observable.next(result.entry);
          observable.complete();
        },
        err => observable.error(err)
      );
    });
  }
  updateSite(id: string, data: SiteBodyUpdate) {
    const updatetrans: string = this._transSV.instant('APP.ACTIONS.EDIT');
    const confirmtrans = this._transSV.instant('APP.DIALOGS.CONFIRM_ACTION_SITE', {
      action: updatetrans.toLowerCase()
    });
    delete data['id'];
    return new Observable(observer => {
      this.handleSV.confirm({ title: updatetrans, message: confirmtrans }).subscribe(isupdate => {
        if (isupdate) {
          this.sitesApi.updateSite(id, data).then(
            result => {
              observer.next(result);
              this.handleSuccess('EDIT');
              observer.complete();
            },
            e => {
              this.handleError(e);
              observer.error(e);
            }
          );
        } else {
          observer.complete();
        }
      });
    });
  }
  deleteSite(id: string) {
    const updatetrans: string = this._transSV.instant('APP.ACTIONS.DELTE');
    const confirmtrans = this._transSV.instant('APP.DIALOGS.CONFIRM_ACTION_SITE', {
      action: updatetrans.toLowerCase()
    });
    return new Observable(observer => {
      this.handleSV.confirm({ title: updatetrans, message: confirmtrans }).subscribe(isupdate => {
        if (isupdate) {
          this.sitesApi.deleteSite(id).then(
            result => {
              observer.next(result);
              this.handleSuccess('DELETE');
              observer.complete();
            },
            e => {
              this.handleError(e);
              observer.error(e);
            }
          );
        } else {
          observer.complete();
        }
      });
    });
  }
  getSiteMembers(id: string, opts?): Observable<SiteMemberPaging> {
    return new Observable(observable => {
      this.sitesApi.getSiteMembers(id, opts).then(
        result => {
          observable.next(result);
          observable.complete;
        },
        err => observable.error(err)
      );
    });
  }
  addSiteMember(siteId: string, body: SiteMembershipBodyCreate) {
    const data = { id: body.id, role: body.role };
    const updatetrans: string = this._transSV.instant('APP.ACTIONS.ADD');
    const confirmtrans = this._transSV.instant('APP.DIALOGS.CONFIRM_ACTION_SITE_MEMBER', {
      action: updatetrans.toLowerCase()
    });
    return new Observable(observer => {
      this.handleSV.confirm({ title: updatetrans, message: confirmtrans }).subscribe(isupdate => {
        if (isupdate) {
          this.sitesApi.addSiteMember(siteId, data).then(
            result => {
              observer.next(result);
              this.handleSuccess('ADD');
              observer.complete();
            },
            e => {
              this.handleError(e);
              observer.error(e);
            }
          );
        } else {
          observer.complete();
        }
      });
    });
  }
  changeRoleOfMember(siteId: string, personId: string, role: SiteMembershipBodyUpdate.RoleEnum) {
    return this.sitesApi.updateSiteMember(siteId, personId, { role });
  }
  deleteSiteMember(siteId: string, personId: string) {
    const updatetrans: string = this._transSV.instant('APP.ACTIONS.DELTE');
    const confirmtrans = this._transSV.instant('APP.DIALOGS.CONFIRM_ACTION_SITE_MEMBER', {
      action: updatetrans.toLowerCase()
    });
    return new Observable(observer => {
      this.handleSV.confirm({ title: updatetrans, message: confirmtrans }).subscribe(isupdate => {
        if (isupdate) {
          this.sitesApi.removeSiteMember(siteId, personId).then(
            result => {
              observer.next(result);
              this.handleSuccess('DELETE');
              observer.complete();
            },
            e => {
              this.handleError(e);
              observer.error(e);
            }
          );
        } else {
          observer.complete();
        }
      });
    });
  }
  handleSuccess(typeaction) {
    const key = `APP.MESSAGES.SITES.${typeaction}_SUCCESS`;
    this.handleSV.showSuccess(key);
  }
  handleError(error) {
    this.handleSV.showError(error);
  }
}