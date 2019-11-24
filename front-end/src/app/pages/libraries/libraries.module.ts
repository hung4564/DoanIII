import { NgModule } from "@angular/core";
import { LibrariesComponent } from "./libraries.component";
import { SharesModule } from "app/layout/shares/shares.module";
import { CoreModule } from "@alfresco/adf-core";
import { ContentModule } from "@alfresco/adf-content-services";
import { ExtensionsModule } from "@alfresco/adf-extensions";
import { LibrariesDetailComponent } from "./libraries-detail/libraries-detail.component";
import { RouterModule } from "@angular/router";
import { LibrariesDocumentComponent } from "./libraries-document/libraries-document.component";
import { LibrariesMemberComponent } from "./libraries-member/libraries-member.component";
import { LibraryService } from "./library.service";
import { FavoriteLibrariesComponent } from "./favorite-libraries/favorite-libraries.component";
import { LibraiesPendingComponent } from "./libraies-pending/libraies-pending.component";
import { LibrariesSettingComponent } from "./libraries-setting/libraries-setting.component";
import { LibrariesApproveComponent } from "./libraries-approve/libraries-approve.component";

@NgModule({
  imports: [
    RouterModule,
    SharesModule,
    ExtensionsModule.forChild(),
    CoreModule.forChild(),
    ContentModule.forChild()
  ],
  declarations: [
    LibrariesApproveComponent,
    LibrariesSettingComponent,
    FavoriteLibrariesComponent,
    LibrariesComponent,
    LibrariesDetailComponent,
    LibrariesDocumentComponent,
    LibrariesMemberComponent,
    LibraiesPendingComponent
  ],
  providers: [LibraryService]
})
export class LibrariesModule {}
