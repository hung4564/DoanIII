import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MinimalNodeEntryEntity } from '@alfresco/js-api';

@Component({
  selector: 'app-versions-tab',
  template: `
    <ng-container *ngIf="isFileSelected; else empty">
      <adf-version-manager
        [showComments]="'adf-version-manager.allowComments' | adfAppConfig: true"
        [allowDownload]="'adf-version-manager.allowDownload' | adfAppConfig: true"
        [node]="node"
      >
      </adf-version-manager>
    </ng-container>

    <ng-template #empty>
      <div class="adf-manage-versions-empty">
        <mat-icon class="adf-manage-versions-empty-icon">face</mat-icon>
        {{ "VERSION.SELECTION.EMPTY" | translate }}
      </div>
    </ng-template>
  `
})
export class VersionsTabComponent implements OnInit, OnChanges {
  @Input()
  node: MinimalNodeEntryEntity;

  isFileSelected = false;

  ngOnInit() {
    this.updateState();
  }

  ngOnChanges() {
    this.updateState();
  }

  private updateState() {
    if (this.node && (<any>this.node).nodeId) {
      // workaround for shared files type.
      this.isFileSelected = true;
    } else {
      this.isFileSelected = this.node.isFile;
    }
  }
}
