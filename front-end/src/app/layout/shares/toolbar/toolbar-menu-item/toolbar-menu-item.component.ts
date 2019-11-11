import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { AppExtensionService } from 'app/extensions/app-extension.service';

@Component({
  selector: 'app-toolbar-menu-item',
  templateUrl: 'toolbar-menu-item.component.html',
  styles: [
    `
      .app-toolbar-menu-item:last-child > .mat-divider-horizontal {
        display: none;
      }
    `
  ],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toolbar-menu-item' }
})
export class ToolbarMenuItemComponent {
  @Input()
  actionRef: ContentActionRef;

  constructor(private extensions: AppExtensionService) {}

  runAction() {
    if (this.hasClickAction(this.actionRef)) {
      this.extensions.runActionById(this.actionRef.actions.click);
    }
  }

  private hasClickAction(actionRef: ContentActionRef): boolean {
    if (actionRef && actionRef.actions && actionRef.actions.click) {
      return true;
    }
    return false;
  }

  trackById(_: number, obj: { id: string }) {
    return obj.id;
  }
}
