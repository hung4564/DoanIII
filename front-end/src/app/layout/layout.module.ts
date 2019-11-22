import { NgModule } from "@angular/core";
import { SharesModule } from "./shares/shares.module";
import { CoreModule } from "@alfresco/adf-core";
import { ContentModule } from "@alfresco/adf-content-services";
import { SidenavComponent } from "./partials//sidenav/sidenav.component";
import { HeaderComponent } from "./partials/header/header.component";
import { CurrentUserComponent } from "./partials/current-user/current-user.component";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { LayoutComponent } from "./layout.component";
import { CoreExtensionsModule } from "app/extensions/core.extensions.module";
import { ExtensionsModule } from "@alfresco/adf-extensions";
import { SearchInputComponent } from "./partials/search-input/search-input.component";
import { SearchLibrariesQueryBuilderService } from "./partials/search-input/search-libraries-query-builder.service";
import { SearchInputControlComponent } from "./partials/search-input/search-input-control/search-input-control.component";
import { CurrentProfileComponent } from "./partials/current-profile/current-profile.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharesModule,
    CoreExtensionsModule.forChild(),
    CoreModule.forChild(),
    ContentModule.forChild(),
    ExtensionsModule
  ],
  declarations: [
    SearchInputComponent,
    SidenavComponent,
    HeaderComponent,
    CurrentUserComponent,
    LayoutComponent,
    SearchInputControlComponent,
    CurrentProfileComponent
  ],
  entryComponents: [CurrentProfileComponent],
  exports: [],
  providers: [SearchLibrariesQueryBuilderService]
})
export class LayoutModule {}
