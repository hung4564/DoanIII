import { SiteEntry } from "@alfresco/js-api";
import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppExtensionService } from "app/extensions/app-extension.service";
import { ContentManagementService } from "app/services/content-management.service";
import { SetCurrentFolderAction } from "app/store/actions/app.actions";
import { NavigateLibraryAction } from "app/store/actions/library.actions";
import { AppStore } from "app/store/states/app.state";
import { PageComponent } from "../page.component";

@Component({
  selector: "app-libraries",
  templateUrl: "./libraries.component.html",
  styleUrls: ["./libraries.component.scss"],
  host: { class: "app-layout" }
})
export class LibrariesComponent extends PageComponent implements OnInit {
  columns: any[] = [];
  constructor(
    content: ContentManagementService,
    public store: Store<AppStore>,
    extensions: AppExtensionService
  ) {
    super(store, extensions, content);
  }

  ngOnInit() {
    super.ngOnInit();
    this.store.dispatch(new SetCurrentFolderAction(null));
    this.subscriptions.push(
      this.content.libraryUpdated.subscribe(() => this.reload()),
      this.content.libraryLeft.subscribe(() => this.reload())
    );
    this.columns = this.extensions.documentListPresets.libraries || [];
  }
  navigateTo(node: SiteEntry) {
    if (node && node.entry && node.entry.guid) {
      this.store.dispatch(new NavigateLibraryAction(node));
    }
  }
}
