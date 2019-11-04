import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Node } from '@alfresco/js-api';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { Location } from '@angular/common';
import { NodePermissionDialogService } from '@alfresco/adf-content-services';

@Component({
  selector: 'app-file-detail',
  templateUrl: './file-detail.component.html',
  styleUrls: ['./file-detail.component.scss']
})
export class FileDetailComponent implements OnInit {
  nodeId: string = null;
  node: Node;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: AlfrescoApiService,
    private location: Location,
    private nodePermissionDialogService: NodePermissionDialogService
  ) {
    this.router.onSameUrlNavigation = 'reload';
  }
  initialiseInvites() {
    this.route.params.subscribe(params => {
      const id = params.nodeId;
      if (id) {
        this.apiService
          .getInstance()
          .nodes.getNodeInfo(id)
          .then(
            node => {
              if (node) {
                this.nodeId = id;
                this.node = node;
                return;
              }
            },
            () => {}
          );
      }
    });
  }
  ngOnInit() {
    this.initialiseInvites();
  }
  opendialog(e) {
    this.nodePermissionDialogService.updateNodePermissionByDialog(this.nodeId).subscribe(
      node => {
        this.onSuccess();
      },
      error => {}
    );
  }
  onSuccess() {
    this.nodeId = undefined;
    this.initialiseInvites();
  }
}
