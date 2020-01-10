import { ContentModule } from "@alfresco/adf-content-services";
import { CoreModule } from "@alfresco/adf-core";
import { ExtensionsModule } from "@alfresco/adf-extensions";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharesModule } from "app/layout/shares/shares.module";
import { FileRecentComponent } from "./file-recent.component";

const routes: Routes = [
  {
    path: "",
    component: FileRecentComponent,
    data: {
      title: "APP.BROWSE.RECENT.TITLE"
    }
  },
  {
    path: "preview/:nodeId",
    component: FileRecentComponent,
    data: {
      title: "APP.BROWSE.RECENT.TITLE",
      navigateSource: "recent-files"
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
  declarations: [FileRecentComponent],
  exports: [FileRecentComponent]
})
export class FileRecentModule {}
