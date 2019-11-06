import { Routes } from '@angular/router';
import { MySitesComponent } from './my-sites.component';

export const MySitesRoutes: Routes = [
  {
    path: 'my-sites',
    component: MySitesComponent,
    data: {
      title: 'APP.BROWSE.LIBRARIES.TITLE'
    }
  }
];
