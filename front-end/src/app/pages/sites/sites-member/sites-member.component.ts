import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Site, SiteMember } from '@alfresco/js-api';
import { SitesService } from '../sites.service';
import { CardViewTextItemModel } from '@alfresco/adf-core';

@Component({
  selector: 'app-sites-member',
  templateUrl: './sites-member.component.html',
  styleUrls: ['./sites-member.component.scss']
})
export class SitesMemberComponent implements OnInit {
  site: Site;
  members: SiteMember[];
  loading = false;
  properties;
  constructor(private route: ActivatedRoute, private siteSv: SitesService) {
    const id = this.route.snapshot.paramMap.get('id');
    this.siteSv.getSite(id).subscribe(result => {
      this.site = result;
    });
    this.siteSv.getSiteMembers(id).subscribe(result => {
      this.members = result.list.entries.map(x => x.entry);
    });
    this.properties = [
      new CardViewTextItemModel({
        label: 'Name',
        value: 'Spock',
        key: 'name',
        default: 'default bar',
        multiline: false,
        icon: 'icon',
        clickCallBack: () => {}
      }),
      new CardViewTextItemModel({
        label: 'Name',
        value: 'Spock',
        key: 'name',
        default: 'default bar',
        multiline: false,
        icon: 'icon',
        clickCallBack: () => {}
      }),
      new CardViewTextItemModel({
        label: 'Name',
        value: 'Spock',
        key: 'name',
        default: 'default bar',
        multiline: false,
        icon: 'icon',
        clickCallBack: () => {}
      })
    ];
  }

  async ngOnInit() {}
}
