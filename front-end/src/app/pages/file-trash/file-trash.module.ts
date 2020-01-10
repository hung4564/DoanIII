import { ContentModule } from "@alfresco/adf-content-services";
import { CoreModule } from "@alfresco/adf-core";
import { ExtensionsModule } from "@alfresco/adf-extensions";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharesModule } from "app/layout/shares/shares.module";
import { FileTrashComponent } from "./file-trash.component";

const routes: Routes = [
  {
    path: "",
    component: FileTrashComponent,
    data: {
      title: "APP.BROWSE.TRASHCAN.TITLE"
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
  declarations: [FileTrashComponent],
  exports: [FileTrashComponent]
})
export class FileTrashModule {}
