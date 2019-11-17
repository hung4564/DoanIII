import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Site, SiteMember, Person } from '@alfresco/js-api';
import { SitesService } from '../sites.service';
import {
  PaginationModel,
  AppConfigService,
  TranslationService,
} from '@alfresco/adf-core';
import { MatDialog } from '@angular/material';
import { SitesMemberRoleComponent } from '../sites-member-role/sites-member-role.component';

@Component({
  selector: 'app-sites-member',
  templateUrl: './sites-member.component.html',
  styleUrls: ['./sites-member.component.scss']
})
export class SitesMemberComponent implements OnInit {
  site: Site = new Site();
  members: SiteMember[];
  loading = false;
  pagination: PaginationModel;
  constructor(
    private route: ActivatedRoute,
    private siteSv: SitesService,
    public dialog: MatDialog,
    private appConfigService: AppConfigService,
    private _transSV: TranslationService
  ) {
    this.loading = true;
    const id = this.route.snapshot.paramMap.get('id');
    this.siteSv.getSite(id).subscribe(result => {
      this.loading = false;
      this.site = result;
    });
    const pagination = {
      skipCount: 0,
      maxItems: this.appConfigService.get<number[]>('pagination.size')
    };
    this.pagination = new PaginationModel(pagination);
    this.getSiteMembers(id, this.pagination);
  }
  getSiteMembers(id: string, opt?) {
    this.siteSv.getSiteMembers(id, opt).subscribe(result => {
      this.members = result.list.entries.map(x => x.entry);
    });
  }
  deleteSiteMember(personId: string) {
    this.siteSv.deleteSiteMember(this.site.id, personId).subscribe(result => {
      this.getSiteMembers(this.site.id, this.pagination);
    });
  }

  onChangePagination(e: PaginationModel) {
    this.getSiteMembers(this.site.id, e);
  }
  editSiteMember(id, person) {
    const updatetrans: string = this._transSV.instant('APP.ACTIONS.EDIT');
    this.openDialog(updatetrans, {
      id: person.id,
      person: person.person,
      role: person.role
    }).subscribe(dataEdit => {
      if (dataEdit) {
        this.siteSv
          .changeRoleOfMember(this.site.id, id, dataEdit.role)
          .then(result => this.getSiteMembers(this.site.id));
      }
    });
  }
  selectPerson(person: Person) {
    if (person) {
      const updatetrans: string = this._transSV.instant('APP.ACTIONS.ADD');
      this.openDialog(updatetrans, {
        id: person.id,
        person: person,
        role: Site.RoleEnum.SiteCollaborator
      }).subscribe(dataCreate => {
        if (dataCreate) {
          this.siteSv
            .addSiteMember(this.site.id, dataCreate)
            .subscribe(result => this.getSiteMembers(this.site.id));
        }
      });
    }
  }

  openDialog(titletrans: string, data: any) {
    return this.dialog
      .open(SitesMemberRoleComponent, {
        data: { titledialog: titletrans, data: data || {} },
        width: '50%'
      })
      .afterClosed();
  }
  async ngOnInit() {}
}
