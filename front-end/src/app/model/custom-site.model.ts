import { Site } from "@alfresco/js-api";

export interface CustomSite extends Site {
  isApprove: boolean;
  nodeIdFolderDocument: string;
  nodeIdFolerApprove: string;
}
