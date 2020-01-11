import { CoreModule } from "@alfresco/adf-core";
import { ExtensionsModule } from "@alfresco/adf-extensions";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DirectivesModule } from "app/directives/directives.module";
import { ToggleFavoriteLibraryComponent } from "./toggle-favorite-library/toggle-favorite-library.component";
import { ToggleFavoriteComponent } from "./toggle-favorite/toggle-favorite.component";
import { ToggleInfoDrawerComponent } from "./toggle-info-drawer/toggle-info-drawer.component";
import { ToggleJoinLibraryButtonComponent } from "./toggle-join-library/toggle-join-library-button.component";
import { ToggleJoinLibraryMenuComponent } from "./toggle-join-library/toggle-join-library-menu.component";
import { ToggleSharedComponent } from "./toggle-shared/toggle-shared.component";
import { ToolbarActionComponent } from "./toolbar-action/toolbar-action.component";
import { ToolbarButtonComponent } from "./toolbar-button/toolbar-button.component";
import { ToolbarMenuItemComponent } from "./toolbar-menu-item/toolbar-menu-item.component";
import { ToolbarMenuComponent } from "./toolbar-menu/toolbar-menu.component";

export function components() {
  return [
    ToggleInfoDrawerComponent,
    ToggleSharedComponent,
    ToggleFavoriteComponent,
    ToolbarButtonComponent,
    ToolbarActionComponent,
    ToolbarMenuItemComponent,
    ToolbarMenuComponent,
    ToggleJoinLibraryButtonComponent,
    ToggleJoinLibraryMenuComponent,
    ToggleFavoriteLibraryComponent
  ];
}

@NgModule({
  imports: [
    CommonModule,
    CoreModule.forChild(),
    ExtensionsModule,
    DirectivesModule
  ],
  declarations: components(),
  exports: components(),
  entryComponents: components()
})
export class AppToolbarModule {}
