import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { MatSnackBar } from '@angular/material';
import { Location } from '@angular/common';
@Component({
  selector: 'app-file-view',
  templateUrl: 'file-view.component.html',
  styleUrls: ['file-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-preview' }
})
export class FileViewComponent implements OnInit {
  nodeId: string = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private apiService: AlfrescoApiService,
    private location: Location
  ) {}

  ngOnInit() {
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
                return;
              }
              this.router.navigate(['/files', id]);
            },
            () => this.router.navigate(['/files', id])
          );
      }
    });
  }

  onUploadError(errorMessage: string) {
    this.snackBar.open(errorMessage, '', { duration: 4000 });
  }
  goBack(e) {
    if (!e) {
      this.location.back();
    }
  }
}
