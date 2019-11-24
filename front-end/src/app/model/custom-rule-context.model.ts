import { RuleContext, NavigationState } from "@alfresco/adf-extensions";
import { CustomSite } from "./custom-site.model";

export interface CustomRuleContext extends RuleContext {
  navigation: CustomNavigationState;
}

export interface CustomNavigationState extends NavigationState {
  currentSite?: CustomSite;
  data?: DataNavigation;
}
export interface DataNavigation {
  disableShowInfoFile: boolean;
  disableShowfavoriteNode: boolean;
  disableShowCopyNode: boolean;
}
export enum NavigationTypeEnum {
  disableShowInfoFile = "disableShowInfoFile",
  disableCopyNode = "disableShowCopyNode",
  disableFavoriteNode = "disableShowfavoriteNode"
}
