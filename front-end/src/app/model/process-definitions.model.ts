import { PaginationModel } from "@alfresco/adf-core";

export interface ProcessDefinitionPaging {
  list: {
    pagination: PaginationModel;
    entries: ProcessDefinitionEntry[];
  };
}
export interface ProcessDefinitionEntry {
  entry: ProcessDefinitionModel;
}
export interface ProcessDefinitionModel {
  id: "string";
  key: "string";
  name: "string";
  category: "string";
  deploymentId: "string";
  title: "string";
  description: "string";
  startFormResourceKey: "string";
  graphicNotationDefined: true;
}
