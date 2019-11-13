import { OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject, Subscription, Observable } from 'rxjs';
import { DocumentListComponent, ShareDataRow } from '@alfresco/adf-content-services';
import { Store } from '@ngrx/store';
import { AppStore } from 'app/store/states/app.state';
import { AppExtensionService } from 'app/extensions/app-extension.service';
import { MinimalNodeEntity, MinimalNodeEntryEntity } from '@alfresco/js-api';
import { ContentActionRef, SelectionState } from '@alfresco/adf-extensions';
import { takeUntil } from 'rxjs/operators';
import { ContentManagementService } from 'app/services/content-management.service';
import { isLocked, isLibrary } from 'app/utils/node.utils';
import { ViewFileAction } from 'app/store/actions/viewer.actions';
import { ReloadDocumentListAction } from 'app/store/actions/app.action';
import {
  getAppSelection,
  getCurrentFolder,
  isInfoDrawerOpened
} from 'app/store/selectors/app.selector';

export class PageComponent implements OnInit, OnDestroy {
  onDestroy$: Subject<boolean> = new Subject<boolean>();
  canUpdateNode = false;
  canUpload = false;
  infoDrawerOpened$: Observable<boolean>;
  @ViewChild(DocumentListComponent)
  documentList: DocumentListComponent;
  node: MinimalNodeEntryEntity;
  protected subscriptions: Subscription[] = [];
  actions: Array<ContentActionRef> = [];
  viewerToolbarActions: Array<ContentActionRef> = [];
  selection: SelectionState;
  constructor(
    protected store: Store<any>,
    protected extensions: AppExtensionService,
    protected content: ContentManagementService
  ) {}
  showPreview(node: MinimalNodeEntity) {
    if (node && node.entry) {
      const parentId = this.node ? this.node.id : null;
      this.store.dispatch(new ViewFileAction(node, parentId));
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
    this.infoDrawerOpened$ = this.store.select(isInfoDrawerOpened);
    this.store
      .select(getAppSelection)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(selection => {
        this.selection = selection;
        this.actions = this.extensions.getAllowedToolbarActions();
        this.viewerToolbarActions = this.extensions.getViewerToolbarActions();
        this.canUpdateNode =
          this.selection.count === 1 && this.content.canUpdateNode(selection.first);
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
      return 'assets/images/baseline-lock-24px.svg';
    }

    if (isLibrary(row.node)) {
      return 'assets/images/baseline-library_books-24px.svg';
    }

    return null;
  }
}
