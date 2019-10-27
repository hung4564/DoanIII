import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output('toggleClicked') toggleClicked = new EventEmitter();
  constructor() {}

  ngOnInit() {}
  toggleMenu(event) {
    this.toggleClicked.emit(event);
  }
}
