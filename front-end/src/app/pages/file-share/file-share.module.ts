import { ContentModule } from "@alfresco/adf-content-services";
import { CoreModule } from "@alfresco/adf-core";
import { ExtensionsModule } from "@alfresco/adf-extensions";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharesModule } from "app/layout/shares/shares.module";
import { PreviewComponent } from "../preview/preview.component";
import { FileShareComponent } from "./file-share.component";

const routes: Routes = [
  {
    path: "",
    component: FileShareComponent,
    data: {
      title: "APP.BROWSE.SHARED.TITLE"
    }
  },
  {
    path: "preview/:nodeId",
    component: PreviewComponent,
    data: {
      title: "APP.PREVIEW.TITLE",
      navigateSource: "personal-files"
    }
  }
];
@NgModule({
  imports: [
    SharesModule,
    RouterModule.forChild(routes),
    ExtensionsModule.forChild(),
    CoreModule.forChild(),
    ContentModule.forChild()
  ],
  declarations: [FileShareComponent],
  exports: [FileShareComponent]
})
export class FileShareModule {}
