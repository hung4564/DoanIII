import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { SharesModule } from 'app/layout/shares/shares.module';
import { CoreModule } from '@alfresco/adf-core';
@NgModule({
  imports: [SharesModule, CoreModule.forChild()],
  declarations: [LoginComponent]
})
export class LoginModule {}
