import { Component, OnInit } from "@angular/core";
import { PageComponent } from "app/pages/page.component";
import { ActivatedRoute } from "@angular/router";
import { ContentManagementService } from "app/services/content-management.service";
import { Store } from "@ngrx/store";
import { AppStore } from "app/store/states/app.state";
import { LibraryService } from "../library.service";
import { AppExtensionService } from "app/extensions/app-extension.service";
import { MinimalNodeEntity } from "@alfresco/js-api";
import { UploadService } from "@alfresco/adf-core";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "app-libraries-approve",
  templateUrl: "./libraries-approve.component.html",
  styleUrls: ["./libraries-approve.component.scss"],
  host: { class: "app-layout" }
})
export class LibrariesApproveComponent extends PageComponent implements OnInit {
  currentNodeId: string;
  columns: any[] = [];
  constructor(
    private route: ActivatedRoute,
    content: ContentManagementService,
    store: Store<AppStore>,
    extensions: AppExtensionService,
    private libraySv: LibraryService,
    private uploadService: UploadService
  ) {
    super(store, extensions, content);
  }
  ngOnInit() {
    this.libraySv.getSite().subscribe(site => {
      const found = this.libraySv.getApproveFolder(
        site.relations.containers.list.entries
      );
      if (found) {
        const nodeId = found.entry.id;
        this.currentNodeId = nodeId;
      }
    });
    this.columns = this.extensions.documentListPresets.siteNodeRequert || [];
    this.subscriptions.push(
      this.uploadService.fileUploadComplete
        .pipe(debounceTime(300))
        .subscribe(() => this.reload()),
      this.uploadService.fileUploadDeleted
        .pipe(debounceTime(300))
        .subscribe(() => this.reload())
    );
  }
  onNodeDoubleClick(node: MinimalNodeEntity) {
    if (node && node.entry) {
      if (node.entry.isFolder) {
        this.currentNodeId = node.entry.id;
        this.libraySv.changeFolderInSite.next(node);
      }

      if (node.entry.id) {
        this.showPreview(node);
      }
    }
  }
  getDataForColumn(context, column) {
    return { ...context, action: column.actions };
  }
}
