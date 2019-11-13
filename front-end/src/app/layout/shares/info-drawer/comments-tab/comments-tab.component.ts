import { Component, Input } from '@angular/core';
import { MinimalNodeEntryEntity } from '@alfresco/js-api';
import { isLocked } from 'app/utils/node.utils';
import { NodePermissionService } from 'app/services/node-permission.service';

@Component({
  selector: 'app-comments-tab',
  template: `
    <adf-comments [readOnly]="!canUpdateNode" [nodeId]="node?.id"></adf-comments>
  `
})
export class CommentsTabComponent {
  @Input()
  node: MinimalNodeEntryEntity;

  constructor(private permission: NodePermissionService) {}

  get canUpdateNode(): boolean {
    if (!this.node) {
      return false;
    }

    if (this.node.isFolder || (this.node.isFile && !isLocked({ entry: this.node }))) {
      return this.permission.check(this.node, ['update']);
    }
    return false;
  }
}
