import { Component, OnInit, OnDestroy } from "@angular/core";
import { ContentActionRef, ContentActionType } from "@alfresco/adf-extensions";
import { Subject } from "rxjs";
import { ContentApiService } from "app/services/content-api.service";

@Component({
  selector: "app-task-create-btn",
  templateUrl: "./task-create-btn.component.html",
  styleUrls: ["./task-create-btn.component.scss"]
})
export class TaskCreateBtnComponent implements OnInit, OnDestroy {
  createActions: ContentActionRef[] = [];
  onDestroy$: Subject<boolean> = new Subject<boolean>();
  isLoading = false;
  constructor(private contentApi: ContentApiService) {}

  ngOnInit() {
    this.isLoading = true;
    this.contentApi.getProcessDefinitions().subscribe(result => {
      this.createActions = result.list.entries.map((x, index) => {
        const entry = x.entry;
        return {
          type: ContentActionType.button,
          id: entry.id,
          order: index,
          title: entry.title,
          description: entry.description,
          actions: {
            click: "SELECT_FORM_TASK",
            data: entry.id
          }
        };
      });
      this.isLoading = false;
    });
  }
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  trackById(_: number, obj: { id: string }) {
    return obj.id;
  }
}
