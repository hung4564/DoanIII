import { Site, SiteEntry } from "@alfresco/js-api";

export interface CustomSite extends Site {
  isApprove: boolean;
  nodeIdFolderDocument: string;
  nodeIdFolerApprove: string;
}
export interface CustomSiteEntry extends SiteEntry {
  entry: CustomSite;
}
