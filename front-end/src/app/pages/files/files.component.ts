import { Component, OnInit, ViewChild } from '@angular/core';
import { DocumentListComponent, ShareDataRow } from '@alfresco/adf-content-services';
import { UploadService, FileUploadEvent } from '@alfresco/adf-core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PageComponent } from '../page.component';
import { AppExtensionService } from 'app/extensions/app-extension.service';
import { AppStore, SetCurrentFolderAction, isAdmin } from 'app/store';
import { Store } from '@ngrx/store';
import { MinimalNodeEntity, PathElement, MinimalNodeEntryEntity } from '@alfresco/js-api';
import { ContentApiService } from 'app/services/content-api.service';
import { NodeActionsService } from 'app/services/node-actions.service';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ContentManagementService } from 'app/services/content-management.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
  host: { class: 'app-layout' }
})
export class FilesComponent extends PageComponent implements OnInit {
  private nodePath: PathElement[];
  isValidPath = true;
  isAdmin = false;
  columns: any[] = [];
  nodeId = '-my-';
  @ViewChild('documentList') documentList: DocumentListComponent;
  constructor(
    protected store: Store<AppStore>,
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
    route.params.subscribe(({ folderId }: Params) => {
      const nodeId = folderId || data.defaultNodeId;
      this.nodeId = nodeId;
      this.contentApi.getNode(nodeId).subscribe(
        node => {
          this.isValidPath = true;

          if (node.entry && node.entry.isFolder) {
            this.updateCurrentNode(node.entry);
          } else {
            this.router.navigate(['/personal-files', node.entry.parentId], {
              replaceUrl: true
            });
          }
        },
        () => (this.isValidPath = false)
      );
    });
    this.subscriptions = this.subscriptions.concat([
      nodeActionsService.contentCopied.subscribe(nodes => this.onContentCopied(nodes)),
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

  displayFolderParent(filePath = '', index: number) {
    const parentName = filePath.split('/')[index];
    const currentFoldersDisplayed = <ShareDataRow[]>this.documentList.data.getRows() || [];

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
      return node && node.entry && node.entry.parentId === this.getParentNodeId();
    });
    if (newNode) {
      this.reload();
    }
  }

  // todo: review this approach once 5.2.3 is out
  private async updateCurrentNode(node: MinimalNodeEntryEntity) {
    this.nodePath = null;

    if (node && node.path && node.path.elements) {
      const elements = node.path.elements;

      this.nodePath = elements.map(pathElement => {
        return Object.assign({}, pathElement);
      });

      if (elements.length > 1) {
        if (elements[1].name === 'User Homes') {
          if (!this.isAdmin) {
            elements.splice(0, 2);
          }
        } else if (elements[1].name === 'Sites') {
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
      const parentNode = await this.contentApi.getNodeInfo(node.parentId).toPromise();
      node.name = parentNode.properties['cm:title'] || parentNode.name;

      // remove the site entry
      elements.splice(1, 1);
    } else {
      // remove 'documentLibrary' in the middle of the path
      const docLib = elements.findIndex(el => el.name === 'documentLibrary');
      if (docLib > -1) {
        const siteFragment = elements[docLib - 1];
        const siteNode = await this.contentApi.getNodeInfo(siteFragment.id).toPromise();

        // apply Site Name to the parent fragment
        siteFragment.name = siteNode.properties['cm:title'] || siteNode.name;
        elements.splice(docLib, 1);
      }
    }
  }
  isSiteContainer(node: MinimalNodeEntryEntity): boolean {
    if (node && node.aspectNames && node.aspectNames.length > 0) {
      return node.aspectNames.indexOf('st:siteContainer') >= 0;
    }
    return false;
  }
  goDetail(e: MinimalNodeEntity) {
    if (e && e.entry) {
      if (e.entry.isFolder) {
        this.navigate(e.entry.id);
      }

      if (e.entry.isFile) {
        const node = e.entry;
        this.router.navigate([`file/${node.id}`]);
      }
    }
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
  navigate(nodeId: string = null) {
    const commands = ['./'];

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
