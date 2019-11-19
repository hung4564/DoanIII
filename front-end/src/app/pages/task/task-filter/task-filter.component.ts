import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-task-filter",
  templateUrl: "./task-filter.component.html",
  styleUrls: ["./task-filter.component.scss"]
})
export class TaskFilterComponent implements OnInit {
  statusSelect: string = "";
  prioritySelect: string;
  @Output("filterChange") filterChangeEvent = new EventEmitter<TaskFilter[]>();
  constructor() {}

  ngOnInit() {}
  filterChange() {
    const filter: TaskFilter[] = [
      { field: "status", value: this.statusSelect, opt: TaskFilterOpt.Equal },
      { field: "priority", value: this.prioritySelect, opt: TaskFilterOpt.Equal }
    ];
    this.filterChangeEvent.emit(filter);
  }
}

export enum TaskFilterOpt {
  Equal = "="
}
export interface TaskFilter {
  field: string;
  value: any;
  opt: TaskFilterOpt;
}
