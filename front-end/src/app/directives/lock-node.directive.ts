import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { NodeEntry, NodeBodyLock, SharedLinkEntry } from '@alfresco/js-api';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { isLocked } from '../utils/node.utils';

@Directive({
  selector: '[acaLockNode]',
  exportAs: 'lockNode'
})
export class LockNodeDirective {
  @Input('acaLockNode')
  node: NodeEntry = null;

  @Output() toggle: EventEmitter<any> = new EventEmitter();
  @Output() lockError: EventEmitter<any> = new EventEmitter();
  @Output() unlockError: EventEmitter<any> = new EventEmitter();

  @HostListener('click')
  onClick() {
    this.toggleLock(this.node);
  }

  constructor(private alfrescoApiService: AlfrescoApiService) {}

  isNodeLocked(): boolean {
    return !!(this.node && isLocked(this.node));
  }

  private async toggleLock(node: NodeEntry | SharedLinkEntry) {
    const id = (<SharedLinkEntry>node).entry.nodeId || node.entry.id;

    if (isLocked(this.node)) {
      try {
        const response = await this.unlockNode(id);

        this.update(response.entry);
        this.toggle.emit(false);
      } catch (error) {
        this.unlockError.emit(error);
      }
    } else {
      try {
        const response = await this.lockNode(id);

        this.update(response.entry);
        this.toggle.emit(true);
      } catch (error) {
        this.lockError.emit(error);
      }
    }
  }

  private lockNode(nodeId: string) {
    return this.alfrescoApiService.nodesApi.lockNode(nodeId, <NodeBodyLock>{
      type: 'ALLOW_OWNER_CHANGES',
      lifetime: 'PERSISTENT'
    });
  }

  private unlockNode(nodeId: string) {
    return this.alfrescoApiService.nodesApi.unlockNode(nodeId);
  }

  private update(data) {
    const properties = this.node.entry.properties || {};

    properties['cm:lockLifetime'] = data.properties['cm:lockLifetime'];
    properties['cm:lockOwner'] = data.properties['cm:lockOwner'];
    properties['cm:lockType'] = data.properties['cm:lockType'];
  }
}
