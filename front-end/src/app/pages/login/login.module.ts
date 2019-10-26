import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { SharesModule } from 'app/layout/shares/shares.module';

@NgModule({
  imports: [SharesModule],
  declarations: [LoginComponent]
})
export class LoginModule {}
