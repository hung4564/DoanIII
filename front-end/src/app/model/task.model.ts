import { PaginationModel } from "@alfresco/adf-core";

export interface TaskPaging {
  list: {
    pagination: PaginationModel;
    entries: TaskEntry[];
  };
}
export interface TaskEntry {
  entry: TaskModel;
}
export interface TaskModel {
  id: "string";
  processId: "string";
  processDefinitionId: "string";
  activityDefinitionId: "string";
  name: "string";
  description: "string";
  dueAt: "2019-11-18T06:28:28.860Z";
  startedAt: "2019-11-18T06:28:28.860Z";
  endedAt: "2019-11-18T06:28:28.860Z";
  durationInMs: 0;
  priority: 0;
  owner: "string";
  assignee: "string";
  formResourceKey: "string";
  state: "unclaimed";
  variables: [
    {
      scope: "string";
      name: "string";
      value: 0;
      type: "string";
    }
  ];
}
