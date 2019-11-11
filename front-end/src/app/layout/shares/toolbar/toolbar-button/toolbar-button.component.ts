import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { AppExtensionService } from 'app/extensions/app-extension.service';

export enum ToolbarButtonType {
  ICON_BUTTON = 'icon-button',
  MENU_ITEM = 'menu-item'
}

@Component({
  selector: 'app-toolbar-button',
  templateUrl: 'toolbar-button.component.html',
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-toolbar-button' }
})
export class ToolbarButtonComponent {
  @Input()
  type: ToolbarButtonType = ToolbarButtonType.ICON_BUTTON;

  @Input()
  color = '';

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
}
