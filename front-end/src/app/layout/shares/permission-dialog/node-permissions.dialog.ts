import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './node-permissions.dialog.html',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'aca-node-permissions-dialog' }
})
export class NodePermissionsDialogComponent {
  nodeId: string;

  constructor(@Inject(MAT_DIALOG_DATA) data: any) {
    this.nodeId = data.nodeId;
  }
}
