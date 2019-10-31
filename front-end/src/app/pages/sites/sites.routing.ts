import { Routes } from '@angular/router';
import { SitesMainComponent } from './sites-main/sites-main.component';

export const SitesRoutes: Routes = [
  {
    path: 'sites',
    children: [{ path: '', component: SitesMainComponent }]
  }
];
