import {
  DocumentListComponent,
  ShareDataRow
} from "@alfresco/adf-content-services";
import { FileUploadEvent, UploadService } from "@alfresco/adf-core";
import {
  MinimalNodeEntity,
  MinimalNodeEntryEntity,
  PathElement,
  PathElementEntity
} from "@alfresco/js-api";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { AppExtensionService } from "app/extensions/app-extension.service";
import { ContentApiService } from "app/services/content-api.service";
import { ContentManagementService } from "app/services/content-management.service";
import { NodeActionsService } from "app/services/node-actions.service";
import { SetCurrentFolderAction } from "app/store/actions/app.actions";
import { isAdmin } from "app/store/selectors/app.selector";
import { debounceTime, takeUntil } from "rxjs/operators";
import { PageComponent } from "../page.component";

@Component({
  selector: "app-files",
  templateUrl: "./files.component.html",
  styleUrls: ["./files.component.scss"],
  host: { class: "app-layout" }
})
export class FilesComponent extends PageComponent implements OnInit {
  private nodePath: PathElement[];
  isAdmin = false;
  columns: any[] = [];
  nodeId = "-my-";
  title: string;
  @ViewChild("documentList") documentList: DocumentListComponent;
  constructor(
    protected store: Store<any>,
    protected extensions: AppExtensionService,
    private router: Router,
    private route: ActivatedRoute,
    private nodeActionsService: NodeActionsService,
    private uploadService: UploadService,
    content: ContentManagementService,
    private contentApi: ContentApiService
  ) {
    super(store, extensions, content);
  }

  ngOnInit() {
    super.ngOnInit();
    this.columns = this.extensions.documentListPresets.files;
    const { route, nodeActionsService, uploadService } = this;
    const { data } = route.snapshot;
    this.title = data.title;
    route.params.subscribe(({ folderId }: Params) => {
      const nodeId = folderId || data.defaultNodeId;
      this.nodeId = nodeId;
      this.contentApi.getNode(nodeId).subscribe(node => {
        if (node.entry && node.entry.isFolder) {
          this.updateCurrentNode(node.entry);
        } else {
          this.router.navigate(["/personal-files", node.entry.parentId], {
            replaceUrl: true
          });
        }
      });
    });
    this.subscriptions = this.subscriptions.concat([
      nodeActionsService.contentCopied.subscribe(nodes =>
        this.onContentCopied(nodes)
      ),
      uploadService.fileUploadComplete
        .pipe(debounceTime(300))
        .subscribe(file => this.onFileUploadedEvent(file)),
      uploadService.fileUploadDeleted
        .pipe(debounceTime(300))
        .subscribe(file => this.onFileUploadedEvent(file))
    ]);

    this.store
      .select(isAdmin)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(value => {
        this.isAdmin = value;
      });
  }
  onFileUploadedEvent(event: FileUploadEvent) {
    const node: MinimalNodeEntity = event.file.data;

    // check root and child nodes
    if (node && node.entry && node.entry.parentId === this.getParentNodeId()) {
      this.reload();
      return;
    }

    // check the child nodes to show dropped folder
    if (event && event.file.options.parentId === this.getParentNodeId()) {
      this.displayFolderParent(event.file.options.path, 0);
      return;
    }

    if (event && event.file.options.parentId) {
      if (this.nodePath) {
        const correspondingNodePath = this.nodePath.find(
          pathItem => pathItem.id === event.file.options.parentId
        );

        // check if the current folder has the 'trigger-upload-folder' as one of its parents
        if (correspondingNodePath) {
          const correspondingIndex =
            this.nodePath.length - this.nodePath.indexOf(correspondingNodePath);
          this.displayFolderParent(event.file.options.path, correspondingIndex);
        }
      }
    }
  }

  displayFolderParent(filePath = "", index: number) {
    const parentName = filePath.split("/")[index];
    const currentFoldersDisplayed =
      <ShareDataRow[]>this.documentList.data.getRows() || [];

    const alreadyDisplayedParentFolder = currentFoldersDisplayed.find(
      row => row.node.entry.isFolder && row.node.entry.name === parentName
    );

    if (alreadyDisplayedParentFolder) {
      return;
    }
    this.reload();
  }

  onContentCopied(nodes: MinimalNodeEntity[]) {
    const newNode = nodes.find(node => {
      return (
        node && node.entry && node.entry.parentId === this.getParentNodeId()
      );
    });
    if (newNode) {
      this.reload();
    }
  }
  private async updateCurrentNode(node: MinimalNodeEntryEntity) {
    this.nodePath = null;

    if (node && node.path && node.path.elements) {
      const elements = node.path.elements;

      this.nodePath = elements.map(pathElement => {
        return Object.assign({}, pathElement);
      });

      if (elements.length > 1) {
        if (elements[1].name === "User Homes") {
          if (!this.isAdmin) {
            elements.splice(0, 2);
          }
        } else if (elements[1].name === "Sites") {
          await this.normalizeSitePath(node);
        }
      }
    }

    this.node = node;
    this.store.dispatch(new SetCurrentFolderAction(node));
  }
  private async normalizeSitePath(node: MinimalNodeEntryEntity) {
    const elements = node.path.elements;

    // remove 'Sites'
    elements.splice(1, 1);

    if (this.isSiteContainer(node)) {
      // rename 'documentLibrary' entry to the target site display name
      // clicking on the breadcrumb entry loads the site content
      const parentNode = await this.contentApi
        .getNodeInfo(node.parentId)
        .toPromise();
      node.name = parentNode.properties["cm:title"] || parentNode.name;

      // remove the site entry
      elements.splice(1, 1);
    } else {
      // remove 'documentLibrary' in the middle of the path
      const docLib = elements.findIndex(el => el.name === "documentLibrary");
      if (docLib > -1) {
        const siteFragment = elements[docLib - 1];
        const siteNode = await this.contentApi
          .getNodeInfo(siteFragment.id)
          .toPromise();

        // apply Site Name to the parent fragment
        siteFragment.name = siteNode.properties["cm:title"] || siteNode.name;
        elements.splice(docLib, 1);
      }
    }
  }
  isSiteContainer(node: MinimalNodeEntryEntity): boolean {
    if (node && node.aspectNames && node.aspectNames.length > 0) {
      return node.aspectNames.indexOf("st:siteContainer") >= 0;
    }
    return false;
  }
  onNodeDoubleClick(node: MinimalNodeEntity) {
    if (node && node.entry) {
      if (node.entry.isFolder) {
        this.navigate(node.entry.id);
      }

      if (node.entry.isFile) {
        this.showPreview(node);
      }
    }
  }
  onBreadcrumbNavigate(route: PathElementEntity) {
    if (this.nodePath && this.nodePath.length > 2) {
      if (
        this.nodePath[1].name === "Sites" &&
        this.nodePath[2].id === route.id
      ) {
        return this.navigate(this.nodePath[3].id);
      }
    }
    this.navigate(route.id);
  }
  navigate(nodeId: string = null) {
    const commands = ["./"];

    if (nodeId && !this.isRootNode(nodeId)) {
      commands.push(nodeId);
    }

    this.router.navigate(commands, {
      relativeTo: this.route.parent
    });
  }
  isRootNode(nodeId: string): boolean {
    if (
      this.node &&
      this.node.path &&
      this.node.path.elements &&
      this.node.path.elements.length > 0
    ) {
      return this.node.path.elements[0].id === nodeId;
    }
    return false;
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this.store.dispatch(new SetCurrentFolderAction(null));
  }
}
