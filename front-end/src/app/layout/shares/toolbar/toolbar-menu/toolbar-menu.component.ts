import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ContentActionRef } from '@alfresco/adf-extensions';

@Component({
  selector: 'app-toolbar-menu',
  templateUrl: 'toolbar-menu.component.html',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toolbar-menu' }
})
export class ToolbarMenuComponent {
  @Input()
  actionRef: ContentActionRef;

  @Input()
  color = '';

  get hasChildren(): boolean {
    return (
      this.actionRef &&
      this.actionRef.children &&
      this.actionRef.children.length > 0
    );
  }

  trackById(_: number, obj: { id: string }) {
    return obj.id;
  }
}
