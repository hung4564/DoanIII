import { Component, OnInit } from '@angular/core';
import { MENUS } from '../sidernav';
import { ASidenavComponent } from 'app/layout/partials/sidenav/sidenav.component';
import { LayoutService } from 'app/layout/layout.service';
@Component({
  selector: 'user-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent extends ASidenavComponent implements OnInit {
  constructor(private layoutSv: LayoutService) {
    super(layoutSv);
    this.menus = MENUS;
  }

  ngOnInit() {}
}
