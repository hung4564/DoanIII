import { OnInit } from '@angular/core';
import { AppConfigService } from '@alfresco/adf-core';
import { LayoutService } from 'app/layout/layout.service';

export abstract class ASidenavComponent implements OnInit {
  menus: any[] = [];
  isMenuMinimized = true;
  constructor(private layoutSV: LayoutService, private appConfigService: AppConfigService) {
    this.isMenuMinimized = this.appConfigService.get<boolean>('sideNav.expandedSidenav', true);
    this.layoutSV.toggleSide$.subscribe(value => {
      this.isMenuMinimized = !value;
    });
  }

  ngOnInit() {}
}
