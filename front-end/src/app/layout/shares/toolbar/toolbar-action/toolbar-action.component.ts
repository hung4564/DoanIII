import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input,
  DoCheck,
  ChangeDetectorRef
} from '@angular/core';
import { ContentActionRef } from '@alfresco/adf-extensions';

@Component({
  selector: 'app-toolbar-action',
  templateUrl: './toolbar-action.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-toolbar-action' }
})
export class ToolbarActionComponent implements DoCheck {
  @Input()
  type = 'icon-button';

  @Input()
  color = '';

  @Input()
  actionRef: ContentActionRef;

  constructor(private cd: ChangeDetectorRef) {}

  // todo: review after ADF 2.6
  // preview component : change detection workaround for children without input
  ngDoCheck() {
    if (this.actionRef.id.includes('app.viewer')) {
      this.cd.markForCheck();
    }
  }
}
