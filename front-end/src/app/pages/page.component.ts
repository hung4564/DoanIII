import { OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { Store } from '@ngrx/store';
import { AppStore } from 'app/store/states/app.state';
import { AppExtensionService } from 'app/extensions/app-extension.service';
import { MinimalNodeEntity, MinimalNodeEntryEntity } from '@alfresco/js-api';
import { ViewNodeAction, ViewNodeExtras } from 'app/store';
import { ContentActionRef } from '@alfresco/adf-extensions';

export class PageComponent implements OnInit, OnDestroy {
  onDestroy$: Subject<boolean> = new Subject<boolean>();

  @ViewChild(DocumentListComponent)
  documentList: DocumentListComponent;
  node: MinimalNodeEntryEntity;
  protected subscriptions: Subscription[] = [];
  constructor(protected store: Store<AppStore>, protected extensions: AppExtensionService) {}
  showPreview(node: MinimalNodeEntity, extras?: ViewNodeExtras) {
    if (node && node.entry) {
      const id = (<any>node).entry.nodeId || (<any>node).entry.guid || node.entry.id;

      this.store.dispatch(new ViewNodeAction(id, extras));
    }
  }
  getParentNodeId(): string {
    return this.node ? this.node.id : null;
  }
  reload(): void {
    this.documentList.reload();
    // this.store.dispatch(new ReloadDocumentListAction());
  }

  trackByActionId(_: number, action: ContentActionRef) {
    return action.id;
  }

  trackById(_: number, obj: { id: string }) {
    return obj.id;
  }
  ngOnInit() {}
  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];

    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
