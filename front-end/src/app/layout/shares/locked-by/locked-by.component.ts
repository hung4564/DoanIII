import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';

import { NodeEntry } from '@alfresco/js-api';

@Component({
  selector: 'app-locked-by',
  template: `
    <mat-icon class="locked_by--icon">lock</mat-icon>
    <span class="locked_by--name">{{ writeLockedBy() }}</span>
  `,
  styleUrls: ['./locked-by.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'app-locked-by'
  }
})
export class LockByComponent implements OnInit {
  @Input()
  context: any;

  node: NodeEntry;

  constructor() {}

  ngOnInit() {
    this.node = this.context.row.node;
  }

  writeLockedBy() {
    return (
      this.node &&
      this.node.entry.properties &&
      this.node.entry.properties['cm:lockOwner'] &&
      this.node.entry.properties['cm:lockOwner'].displayName
    );
  }
}
