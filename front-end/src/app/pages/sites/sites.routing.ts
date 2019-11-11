import { Routes } from '@angular/router';
import { SitesMainComponent } from './sites-main/sites-main.component';
import { SitesMemberComponent } from './sites-member/sites-member.component';

export const SitesRoutes: Routes = [
  {
    path: 'sites',
    children: [
      { path: '', component: SitesMainComponent },
      { path: ':id/members', component: SitesMemberComponent }
    ]
  }
];
