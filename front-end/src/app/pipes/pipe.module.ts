import { NgModule } from '@angular/core';
import { EnumToArrayPipe } from './enumToArray.pipe';

@NgModule({
  declarations: [EnumToArrayPipe],
  exports: [EnumToArrayPipe]
})
export class MainPipe {}
