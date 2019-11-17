import { Component, Input, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { MinimalNodeEntity, MinimalNodeEntryEntity, SiteEntry } from '@alfresco/js-api';
import { SidebarTabRef } from '@alfresco/adf-extensions';
import { Store } from '@ngrx/store';
import { ContentApiService } from 'app/services/content-api.service';
import { SetInfoDrawerStateAction } from 'app/store/actions/app.action';
import { AppExtensionService } from 'app/extensions/app-extension.service';

@Component({
  selector: 'app-info-drawer',
  styleUrls: ['./info-drawer.component.scss'],
  templateUrl: './info-drawer.component.html'
})
export class InfoDrawerComponent implements OnChanges, OnInit, OnDestroy {
  @Input()
  nodeId: string;
  @Input()
  node: MinimalNodeEntity;

  isLoading = false;
  displayNode: MinimalNodeEntryEntity | SiteEntry;
  tabs: Array<SidebarTabRef> = [];

  constructor(
    private store: Store<any>,
    private contentApi: ContentApiService,
    private extensions: AppExtensionService
  ) {}

  ngOnInit() {
    this.tabs = this.extensions.getSidebarTabs();
  }

  ngOnDestroy() {
    this.store.dispatch(new SetInfoDrawerStateAction(false));
  }

  ngOnChanges() {
    if (this.node) {
      if (this.node['isLibrary']) {
        return this.setDisplayNode(this.node);
      }

      const entry: any = this.node.entry;

      if (!entry.aspectNames) {
        const id = entry.nodeId || entry.id;
        return this.loadNodeInfo(id);
      }

      this.setDisplayNode(entry);
    }
  }

  private loadNodeInfo(nodeId: string) {
    if (nodeId) {
      this.isLoading = true;

      this.contentApi.getNodeInfo(nodeId).subscribe(
        entity => {
          this.setDisplayNode(entity);
          this.isLoading = false;
        },
        () => (this.isLoading = false)
      );
    }
  }

  private setDisplayNode(node: any) {
    this.displayNode = node;
  }
}
