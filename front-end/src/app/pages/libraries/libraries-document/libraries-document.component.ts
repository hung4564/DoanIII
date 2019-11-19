import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ContentManagementService } from "app/services/content-management.service";
import { Store } from "@ngrx/store";
import { AppStore } from "app/store/states/app.state";
import { PageComponent } from "app/pages/page.component";
import { AppExtensionService } from "app/extensions/app-extension.service";
import { MinimalNodeEntity, PathElement } from "@alfresco/js-api";
import { ShareDataRow } from "@alfresco/adf-content-services";

@Component({
  selector: "app-libraries-document",
  templateUrl: "./libraries-document.component.html",
  styleUrls: ["./libraries-document.component.scss"],
  host: { class: "app-layout" }
})
export class LibrariesDocumentComponent extends PageComponent implements OnInit {
  librariesId: string;
  currentNodeId: string;
  constructor(
    private route: ActivatedRoute,
    content: ContentManagementService,
    store: Store<AppStore>,
    extensions: AppExtensionService
  ) {
    super(store, extensions, content);
  }

  ngOnInit() {
    super.ngOnInit();
    const { route } = this;
    route.params.subscribe(params => {
      this.librariesId = params.id;
      this.currentNodeId = params.id;
    });
    this.subscriptions = [
      this.content.changeFolderInBreadcrumb.subscribe(id => {
        this.currentNodeId = id;
      })
    ];
  }
  onContentCopied(nodes: MinimalNodeEntity[]) {
    const newNode = nodes.find(node => {
      return node && node.entry && node.entry.parentId === this.getParentNodeId();
    });
    if (newNode) {
      this.reload();
    }
  }

  onNodeDoubleClick(node: MinimalNodeEntity) {
    if (node && node.entry) {
      if (node.entry.isFolder) {
        this.currentNodeId = node.entry.id;
        this.content.changeFolderInSite.next(node);
      }

      if (node.entry.isFile) {
        this.showPreview(node);
      }
    }
  }
}
