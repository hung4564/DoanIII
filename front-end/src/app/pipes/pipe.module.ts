import { NgModule } from "@angular/core";
import { LibraryRolePipe } from "./libraryRole.pipe";

@NgModule({
  declarations: [LibraryRolePipe],
  exports: [LibraryRolePipe]
})
export class MainPipe {}
