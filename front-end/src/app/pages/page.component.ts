import {
  DocumentListComponent,
  ShareDataRow
} from "@alfresco/adf-content-services";
import { PaginationModel } from "@alfresco/adf-core";
import { ContentActionRef } from "@alfresco/adf-extensions";
import { MinimalNodeEntity, MinimalNodeEntryEntity } from "@alfresco/js-api";
import { OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppExtensionService } from "app/extensions/app-extension.service";
import { ContentManagementService } from "app/services/content-management.service";
import { ReloadDocumentListAction } from "app/store/actions/app.actions";
import {
  ViewNodeAction,
  ViewNodeExtras
} from "app/store/actions/viewer.actions";
import {
  getAppSelection,
  getCurrentFolder,
  isSmallScreenSelector
} from "app/store/selectors/app.selector";
import { isLibrary, isLocked } from "app/utils/node.utils";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

export class PageComponent implements OnInit, OnDestroy {
  onDestroy$: Subject<boolean> = new Subject<boolean>();
  canUpdateNode = false;
  canUpload = false;
  @ViewChild(DocumentListComponent)
  documentList: DocumentListComponent;
  node: MinimalNodeEntryEntity;
  protected subscriptions: Subscription[] = [];
  actions: ContentActionRef[] = [];
  pagination: PaginationModel = new PaginationModel();
  isSmallScreen = false;
  constructor(
    protected store: Store<any>,
    protected extensions: AppExtensionService,
    protected content: ContentManagementService
  ) {
    this.pagination = new PaginationModel();
  }
  showPreview(node: MinimalNodeEntity, extras?: ViewNodeExtras) {
    if (node && node.entry) {
      const id =
        (<any>node).entry.nodeId || (<any>node).entry.guid || node.entry.id;

      this.store.dispatch(new ViewNodeAction(id, extras));
    }
  }
  getParentNodeId(): string {
    return this.node ? this.node.id : null;
  }
  reload(): void {
    this.store.dispatch(new ReloadDocumentListAction());
  }

  trackByActionId(_: number, action: ContentActionRef) {
    return action.id;
  }

  trackById(_: number, obj: { id: string }) {
    return obj.id;
  }
  ngOnInit() {
    this.store.select(isSmallScreenSelector).subscribe(result => {
      this.isSmallScreen = result;
    });
    this.store
      .select(getAppSelection)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(selection => {
        this.actions = this.extensions.getAllowedToolbarActions();
      });
    this.store
      .select(getCurrentFolder)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(node => {
        this.canUpload = node && this.content.canUploadContent(node);
      });
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];

    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
  imageResolver(row: ShareDataRow): string | null {
    if (isLocked(row.node)) {
      return "assets/images/baseline-lock-24px.svg";
    }

    if (isLibrary(row.node)) {
      return "assets/images/baseline-library_books-24px.svg";
    }

    return null;
  }
}
