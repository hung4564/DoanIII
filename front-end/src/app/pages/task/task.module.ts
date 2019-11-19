import { NgModule } from "@angular/core";
import { TaskComponent } from "./task.component";
import { CoreModule } from "@alfresco/adf-core";
import { SharesModule } from "app/layout/shares/shares.module";
import { ExtensionsModule } from "@alfresco/adf-extensions";
import { ContentModule } from "@alfresco/adf-content-services";
import { TaskFilterComponent } from "./task-filter/task-filter.component";
import { TaskDetailComponent } from "./task-detail/task-detail.component";
import { TaskCreateBtnComponent } from "./task-create-btn/task-create-btn.component";
import { TaskCreateComponent } from "./task-create/task-create.component";
@NgModule({
  imports: [
    SharesModule,
    ExtensionsModule.forChild(),
    CoreModule.forChild(),
    ContentModule.forChild()
  ],
  declarations: [
    TaskComponent,
    TaskFilterComponent,
    TaskDetailComponent,
    TaskCreateBtnComponent,
    TaskCreateComponent
  ],
  providers: []
})
export class TaskModule {}
