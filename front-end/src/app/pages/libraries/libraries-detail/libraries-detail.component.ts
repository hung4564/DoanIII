import { Component, OnInit, OnDestroy, OnChanges } from "@angular/core";
import { AppExtensionService } from "app/extensions/app-extension.service";
import { Store } from "@ngrx/store";
import { AppStore } from "app/store/states/app.state";
import { Router, ActivatedRoute } from "@angular/router";
import { ContentApiService } from "app/services/content-api.service";
import {
  SetCurrentFolderAction,
  ReloadDocumentListAction,
  SetCurrentLibraryAction
} from "app/store/actions/app.action";
import { ContentActionRef } from "@alfresco/adf-extensions";
import { getAppSelection, isAdmin } from "app/store/selectors/app.selector";
import { takeUntil, debounceTime } from "rxjs/operators";
import { Subject, Subscription } from "rxjs";
import {
  MinimalNodeEntity,
  PathElementEntity,
  MinimalNodeEntryEntity,
  PathElement,
  Site
} from "@alfresco/js-api";
import { NodeActionsService } from "app/services/node-actions.service";
import {
  UploadService,
  FileUploadEvent,
  PageTitleService
} from "@alfresco/adf-core";
import { LibraryService } from "../library.service";

@Component({
  selector: "app-libraries-detail",
  templateUrl: "./libraries-detail.component.html",
  styleUrls: ["./libraries-detail.component.scss"],
  host: { class: "app-layout" }
})
export class LibrariesDetailComponent implements OnInit, OnDestroy {
  private nodePath: PathElement[];
  getParentNodeId(): string {
    return this.node ? this.node.id : null;
  }
  links: {
    link: string;
    title: string;
    active: boolean;
  }[] = [
    { link: "", title: "Documents", active: true },
    { link: "members", title: "Members", active: false }
  ];
  isAdmin = false;
  actions: Array<ContentActionRef> = [];
  librariesId: string;
  onDestroy$: Subject<boolean> = new Subject<boolean>();
  node: MinimalNodeEntryEntity;
  protected subscriptions: Subscription[] = [];
  title: string;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppStore>,
    protected extensions: AppExtensionService,
    private contentApi: ContentApiService,
    private nodeActionsService: NodeActionsService,
    private uploadService: UploadService,
    private libraySv: LibraryService,
    private pageTitle: PageTitleService
  ) {}
  trackByActionId(_: number, action: ContentActionRef) {
    return action.id;
  }
  ngOnInit() {
    this.title = "APP.BROWSE.LIBRARIES.MENU.MY_LIBRARIES.TITLE";
    this.store
      .select(isAdmin)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(value => {
        this.isAdmin = value;
      });
    this.store
      .select(getAppSelection)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(selection => {
        this.actions = this.extensions.getAllowedToolbarActions();
      });

    const { route, nodeActionsService, uploadService } = this;

    route.params.subscribe(params => {
      this.librariesId = params.id;
      this.libraySv.setSiteId(this.librariesId);
      this.libraySv.getSite(this.librariesId).subscribe(site => {
        this.pageTitle.setTitle(site.entry.title || "");
        this.store.dispatch(new SetCurrentLibraryAction(site.entry));
        if (
          site.entry.visibility == Site.VisibilityEnum.MODERATED &&
          site.entry.role == Site.RoleEnum.SiteManager
        ) {
          this.links.push({
            link: "pendings",
            title: "Pending",
            active: false
          });
        }
        const found = this.libraySv.getNodeOfDocumentLibrary(site);
        if (found) {
          const nodeId = found.entry.id;
          this.contentApi.getNode(nodeId).subscribe(node => {
            if (node.entry && node.entry.isFolder) {
              this.updateCurrentNode(node.entry);
            }
          });
        }
      });
    });
    this.subscriptions = this.subscriptions.concat([
      this.libraySv.changeFolderInSite.subscribe(node => {
        if (node.entry && node.entry.isFolder) {
          this.updateCurrentNode(node.entry);
        }
      }),
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
  async getNode(node: MinimalNodeEntity) {
    if (node.entry) {
      this.store.dispatch(new SetCurrentFolderAction(node.entry));
    }
    await this.normalizeSitePath(node.entry);
    this.node = node.entry;
  }
  ngOnDestroy() {
    this.libraySv.setSiteId(null);
    this.store.dispatch(new SetCurrentLibraryAction(null));
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];

    this.onDestroy$.next(true);
    this.onDestroy$.complete();
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
  navigate(index: number) {
    const commands = ["./"];

    commands.push(this.librariesId);
    if (index >= 0) {
      this.links.forEach((element, i) => {
        element.active = false;
        if (i == index) {
          element.active = true;
          commands.push(element.link);
        }
      });
    }
    this.router.navigate(commands, {
      relativeTo: this.route.parent
    });
  }
  onBreadcrumbNavigate(route: PathElementEntity) {
    let navigateId = route.id;
    if (this.nodePath && this.nodePath.length > 2) {
      if (
        this.nodePath[1].name === "Sites" &&
        this.nodePath[2].id === route.id
      ) {
        navigateId = this.nodePath[3].id;
      }
    }
    if (route.name == this.title) {
      this.router.navigate(["./", "libraries"]);
      return;
    }
    this.contentApi.getNode(navigateId).subscribe(node => {
      if (node.entry && node.entry.isFolder) {
        this.updateCurrentNode(node.entry);
        this.libraySv.changeFolderInBreadcrumb.next(node.entry.id);
      }
    });
  }
  onFileUploadedEvent(event: FileUploadEvent) {
    const node: MinimalNodeEntity = event.file.data;

    // check root and child nodes
    if (node && node.entry && node.entry.parentId === this.getParentNodeId()) {
      this.reload();
      return;
    }
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
  reload(): void {
    this.store.dispatch(new ReloadDocumentListAction());
  }
}
