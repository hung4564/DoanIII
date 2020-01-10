import { ContentModule } from "@alfresco/adf-content-services";
import { CoreModule } from "@alfresco/adf-core";
import { ExtensionsModule } from "@alfresco/adf-extensions";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharesModule } from "app/layout/shares/shares.module";
import { PreviewComponent } from "../preview/preview.component";
import { FileFavoriteComponent } from "./file-favorite.component";

const routes: Routes = [
  {
    path: "",
    component: FileFavoriteComponent,
    data: {
      title: "APP.BROWSE.FAVORITES.TITLE"
    }
  },
  {
    path: "preview/:nodeId",
    component: PreviewComponent,
    data: {
      title: "APP.PREVIEW.TITLE",
      navigateSource: "favorites"
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
  declarations: [FileFavoriteComponent],
  exports: [FileFavoriteComponent]
})
export class FileFavoriteModule {}
