import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { AppStore } from 'app/store/states/app.state';
import { Store } from '@ngrx/store';
import { getHeaderColor, getAppName, getLogoPath } from 'app/store/selectors/app.selector';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output('toggleClicked') toggleClicked = new EventEmitter();
  constructor(
    store: Store<AppStore>,) {
      this.headerColor$ = store.select(getHeaderColor);
      this.appName$ = store.select(getAppName);
      this.logo$ = store.select(getLogoPath);}

  appName$: Observable<string>;
  headerColor$: Observable<string>;
  logo$: Observable<string>;
  ngOnInit() {}
  toggleMenu(event) {
    this.toggleClicked.emit(event);
  }
}
