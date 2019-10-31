import { NgModule } from '@angular/core';
import { SitesMainComponent } from './sites-main/sites-main.component';
import { SharesModule } from 'app/layout/shares/shares.module';
import { CoreModule } from '@alfresco/adf-core';
import { ContentModule } from '@alfresco/adf-content-services';
import { SitesService } from './sites.service';
import { SitesDetailComponent } from './sites-detail/sites-detail.component';
import { SitesMemberComponent } from './sites-member/sites-member.component';
@NgModule({
  imports: [SharesModule, CoreModule.forChild(), ContentModule.forChild()],
  declarations: [SitesMemberComponent, SitesMainComponent, SitesDetailComponent],
  providers: [SitesService],
  entryComponents: [SitesDetailComponent]
})
export class SitesModule {}
