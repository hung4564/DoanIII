import { ContentModule } from "@alfresco/adf-content-services";
import { CoreModule } from "@alfresco/adf-core";
import { ExtensionsModule } from "@alfresco/adf-extensions";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CoreExtensionsModule } from "app/extensions/core.extensions.module";
import { LayoutComponent } from "./layout.component";
import { CurrentProfileComponent } from "./partials/current-profile/current-profile.component";
import { CurrentUserComponent } from "./partials/current-user/current-user.component";
import { HeaderComponent } from "./partials/header/header.component";
import { SearchInputControlComponent } from "./partials/search-input/search-input-control/search-input-control.component";
import { SearchInputComponent } from "./partials/search-input/search-input.component";
import { SearchLibrariesQueryBuilderService } from "./partials/search-input/search-libraries-query-builder.service";
import { SidenavComponent } from "./partials/sidenav/sidenav.component";
import { SharesModule } from "./shares/shares.module";

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
