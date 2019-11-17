import { MinimalNodeEntryEntity } from '@alfresco/js-api';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { NodePermissionsDialogComponent } from '../permission-dialog/node-permissions.dialog';
import {
  PermissionListComponent,
  NodePermissionDialogService
} from '@alfresco/adf-content-services';
import { ContentApiService } from 'app/services/content-api.service';
import { SnackbarErrorAction } from 'app/store/actions/snackbar.actions';

@Component({
  selector: 'app-permission-manager',
  templateUrl: './permission-manager.component.html'
})
export class PermissionsManagerComponent implements OnInit {
  @ViewChild('permissionList')
  permissionList: PermissionListComponent;

  @Input()
  nodeId: string;

  toggleStatus = false;

  constructor(
    private store: Store<any>,
    private dialog: MatDialog,
    private contentApi: ContentApiService,
    private nodePermissionDialogService: NodePermissionDialogService
  ) {}

  ngOnInit() {
    this.contentApi
      .getNodeInfo(this.nodeId, { include: ['permissions'] })
      .subscribe((currentNode: MinimalNodeEntryEntity) => {
        this.toggleStatus = currentNode.permissions.isInheritanceEnabled;
      });
  }

  onError(errorMessage: string) {
    this.store.dispatch(new SnackbarErrorAction(errorMessage));
  }

  onUpdate() {
    this.permissionList.reload();
  }

  onUpdatedPermissions(node: MinimalNodeEntryEntity) {
    this.toggleStatus = node.permissions.isInheritanceEnabled;
    this.permissionList.reload();
  }

  openAddPermissionDialog() {
    this.nodePermissionDialogService.updateNodePermissionByDialog(this.nodeId).subscribe(
      () => {
        this.dialog.open(NodePermissionsDialogComponent, {
          data: { nodeId: this.nodeId },
          panelClass: 'app-permissions-dialog-panel',
          width: '800px'
        });
      },
      error => {
        this.store.dispatch(new SnackbarErrorAction(error));
      }
    );
  }
}
