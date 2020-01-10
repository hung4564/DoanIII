import { CoreModule } from "@alfresco/adf-core";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharesModule } from "app/layout/shares/shares.module";
import { CoreExtensionsModule } from "../../extensions/core.extensions.module";
import { SharedLinkViewComponent } from "./shared-link-view.component";

const routes: Routes = [
  {
    path: "",
    component: SharedLinkViewComponent,
    data: {
      title: "APP.PREVIEW.TITLE",
      navigateMultiple: true
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CoreModule.forChild(),
    CoreExtensionsModule.forChild(),
    SharesModule
  ],
  declarations: [SharedLinkViewComponent],
  exports: [SharedLinkViewComponent]
})
export class AppSharedLinkViewModule {}
