import { Component, OnInit, OnDestroy } from "@angular/core";
import { ContentManagementService } from "app/services/content-management.service";
import { Router, ActivatedRoute } from "@angular/router";
import { UserPreferencesService } from "@alfresco/adf-core";
import { Store } from "@ngrx/store";
import { ContentApiService } from "app/services/content-api.service";

@Component({
  selector: "app-task-create",
  templateUrl: "./task-create.component.html",
  styleUrls: ["./task-create.component.scss"]
})
export class TaskCreateComponent implements OnInit, OnDestroy {
  constructor(
    private content: ContentManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<any>,
    private contentApi: ContentApiService
  ) {}

  ngOnInit() {
    this.content.changeTaskForm.subscribe(id => {
      this.contentApi.getProcessDefinitionForm(id).subscribe(result => {
        console.log("TCL: TaskCreateComponent -> ngOnInit -> result", result);
      });
    });
  }
  ngOnDestroy() {
    this.content.changeTaskForm.unsubscribe();
  }
}
