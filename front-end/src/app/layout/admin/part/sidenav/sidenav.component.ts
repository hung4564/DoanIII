import { Component, OnInit, Input } from '@angular/core';
import { MENUS } from '../sidernav';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  menus = MENUS;
  @Input() isMenuMinimized = true;
  constructor() {}

  ngOnInit() {}
}
