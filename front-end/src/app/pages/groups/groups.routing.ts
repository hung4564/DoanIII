import { Routes, RouterModule } from '@angular/router';
import { GroupsMainComponent } from './groups-main/groups-main.component';

export const GroupsRoutes: Routes = [
  {
    path: 'groups',
    children: [{ path: '', component: GroupsMainComponent }]
  }
];
