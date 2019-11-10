import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { AppExtensionService } from 'app/extensions/app-extension.service';

@Component({
  selector: 'app-context-menu-item',
  templateUrl: 'context-menu-item.component.html',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-context-menu-item' }
})
export class ContextMenuItemComponent {
  @Input()
  actionRef: ContentActionRef;

  constructor(private extensions: AppExtensionService) {}

  runAction() {
    console.log('TCL: ContextMenuItemComponent -> runAction -> this.actionRef', this.actionRef);
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
