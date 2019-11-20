import { Component, OnInit } from "@angular/core";
import { PageComponent } from "app/pages/page.component";
import { ContentManagementService } from "app/services/content-management.service";
import { AppExtensionService } from "app/extensions/app-extension.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { ContentApiService } from "app/services/content-api.service";
import { TaskModel } from "app/model/task.model";

@Component({
  selector: "app-task-detail",
  templateUrl: "./task-detail.component.html",
  styleUrls: ["./task-detail.component.scss"]
})
export class TaskDetailComponent extends PageComponent implements OnInit {
  isLoading = false;
  taskId: string = "";
  task: TaskModel;
  constructor(
    content: ContentManagementService,
    private router: Router,
    private route: ActivatedRoute,
    store: Store<any>,
    extensions: AppExtensionService,
    private contentApi: ContentApiService
  ) {
    super(store, extensions, content);
  }

  ngOnInit() {
    super.ngOnInit();
    this.isLoading = true;
    this.route.params.subscribe(params => {
      this.taskId = params.taskId;
      this.getTask(this.taskId);
    });
  }
  getTask(taskId: string) {
    this.isLoading = true;
    this.contentApi.getTask(taskId).subscribe(
      result => {
        this.task = result.entry;
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
      }
    );
  }
}
