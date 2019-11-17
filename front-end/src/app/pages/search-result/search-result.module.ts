import { NgModule } from '@angular/core';
import { SharesModule } from 'app/layout/shares/shares.module';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { SearchResultsComponent } from './search-results/search-results.component';
import { SearchResultsRowComponent } from './search-results-row/search-results-row.component';
import { SearchLibrariesResultsComponent } from './search-libraries-results/search-libraries-results.component';
import { ExtensionsModule } from '@alfresco/adf-extensions';

@NgModule({
  imports: [
    SharesModule,
    CoreModule.forChild(),
    ContentModule.forChild(),
    ExtensionsModule.forChild()
  ],
  declarations: [SearchLibrariesResultsComponent, SearchResultsComponent, SearchResultsRowComponent]
})
export class SearchResultModule {}
