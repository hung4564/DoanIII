import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { Observable } from "rxjs";
import { AppStore } from "app/store/states/app.state";
import { Store } from "@ngrx/store";
import {
  getHeaderColor,
  getAppName,
  getLogoPath
} from "app/store/selectors/app.selector";
import { ContentActionRef } from "@alfresco/adf-extensions";
import { AppExtensionService } from "app/extensions/app-extension.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  actions: ContentActionRef[] = [];
  @Output("toggleClicked") toggleClicked = new EventEmitter();
  constructor(store: Store<any>, private appExtensions: AppExtensionService) {
    this.headerColor$ = store.select(getHeaderColor);
    this.appName$ = store.select(getAppName);
    this.logo$ = store.select(getLogoPath);
  }

  appName$: Observable<string>;
  headerColor$: Observable<string>;
  logo$: Observable<string>;
  ngOnInit() {
    this.actions = this.appExtensions.getHeaderActions();
  }
  toggleMenu(event) {
    this.toggleClicked.emit(event);
  }
}
