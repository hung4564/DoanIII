import { ContentModule } from "@alfresco/adf-content-services";
import { CoreModule } from "@alfresco/adf-core";
import { ExtensionsModule } from "@alfresco/adf-extensions";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SharesModule } from "app/layout/shares/shares.module";
import { PreviewComponent } from "../preview/preview.component";
import { SearchLibrariesResultsComponent } from "./search-libraries-results/search-libraries-results.component";
import { SearchResultsRowComponent } from "./search-results-row/search-results-row.component";
import { SearchResultsComponent } from "./search-results/search-results.component";

const routes: Routes = [
  {
    path: "",
    component: SearchResultsComponent,
    data: {
      title: "APP.BROWSE.SEARCH.TITLE"
    }
  },
  {
    path: "preview/:nodeId",
    children: [
      {
        path: "",
        data: {
          navigateSource: "search"
        },
        component: PreviewComponent
      }
    ]
  },
  {
    path: "libraries",
    children: [
      {
        path: "",
        component: SearchLibrariesResultsComponent,
        data: {
          title: "APP.BROWSE.SEARCH.TITLE"
        }
      },
      {
        path: "preview/:nodeId",
        children: [
          {
            path: "",
            data: {
              navigateSource: "search/libraries"
            },
            component: PreviewComponent
          }
        ]
      }
    ]
  }
];
@NgModule({
  imports: [
    SharesModule,
    RouterModule.forChild(routes),
    CoreModule.forChild(),
    ContentModule.forChild(),
    ExtensionsModule.forChild()
  ],
  declarations: [
    SearchLibrariesResultsComponent,
    SearchResultsComponent,
    SearchResultsRowComponent
  ]
})
export class SearchResultModule {}
