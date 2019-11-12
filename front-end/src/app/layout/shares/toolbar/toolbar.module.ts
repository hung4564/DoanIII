import { NgModule } from '@angular/core';
import { ToggleFavoriteComponent } from './toggle-favorite/toggle-favorite.component';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@alfresco/adf-core';
import { ToolbarButtonComponent } from './toolbar-button/toolbar-button.component';
import { ToolbarActionComponent } from './toolbar-action/toolbar-action.component';
import { ExtensionsModule } from '@alfresco/adf-extensions';
import { ToolbarMenuItemComponent } from './toolbar-menu-item/toolbar-menu-item.component';
import { ToolbarMenuComponent } from './toolbar-menu/toolbar-menu.component';
import { ToggleJoinLibraryButtonComponent } from './toggle-join-library/toggle-join-library-button.component';
import { ToggleJoinLibraryMenuComponent } from './toggle-join-library/toggle-join-library-menu.component';
import { ToggleFavoriteLibraryComponent } from './toggle-favorite-library/toggle-favorite-library.component';
import { ToggleEditOfflineComponent } from './toggle-edit-offline/toggle-edit-offline.component';
import { DirectivesModule } from 'app/directives/directives.module';
import { ToggleSharedComponent } from './toggle-shared/toggle-shared.component';

export function components() {
  return [
    ToggleSharedComponent,
    ToggleFavoriteComponent,
    ToolbarButtonComponent,
    ToolbarActionComponent,
    ToolbarMenuItemComponent,
    ToolbarMenuComponent,
    ToggleJoinLibraryButtonComponent,
    ToggleJoinLibraryMenuComponent,
    ToggleFavoriteLibraryComponent,
    ToggleEditOfflineComponent
  ];
}

@NgModule({
  imports: [CommonModule, CoreModule.forChild(), ExtensionsModule, DirectivesModule],
  declarations: components(),
  exports: components(),
  entryComponents: components()
})
export class AppToolbarModule {}
