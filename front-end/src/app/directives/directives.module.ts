import { NgModule } from '@angular/core';
import { ContextActionsDirective } from './ContextActions/context-actions.directive';
import { ContextMenuComponent } from './ContextActions/context-menu/context-menu.component';
import { ContextMenuService } from './ContextActions/context-menu.service';
import { ContextMenuItemComponent } from './ContextActions/context-menu-item/context-menu-item.component';
import { MaterialModule } from 'app/layout/shares/material.module';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@alfresco/adf-core';
import { CoreExtensionsModule } from 'app/extensions/core.extensions.module';
import { OutsideEventDirective } from './ContextActions/context-menu-outside-event.directive';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { DocumentListDirective } from './document-list.directive';
import { LibraryMembershipDirective } from './library-membership.directive';
import { LibraryFavoriteDirective } from './library-favorite.directive';
import { LockNodeDirective } from './lock-node.directive';
import { PaginationDirective } from './pagination.directive';

export function directives() {
  return [
    PaginationDirective,
    LockNodeDirective,
    LibraryFavoriteDirective,
    LibraryMembershipDirective,
    DocumentListDirective,
    ContextActionsDirective,
    OutsideEventDirective,
    ContextMenuComponent,
    ContextMenuItemComponent
  ];
}
@NgModule({
  imports: [
    MaterialModule,
    CoreExtensionsModule.forChild(),
    CoreModule.forChild(),
    CommonModule,
    ExtensionsModule
  ],
  declarations: [...directives(), DocumentListDirective],
  exports: [...directives()],
  entryComponents: [ContextMenuComponent],
  providers: [ContextMenuService]
})
export class DirectivesModule {}
