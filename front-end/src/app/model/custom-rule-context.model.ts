import { RuleContext, NavigationState } from "@alfresco/adf-extensions";
import { Site } from "@alfresco/js-api";

export interface CustomRuleContext extends RuleContext {
  navigation: CustomNavigationState;
}

export interface CustomNavigationState extends NavigationState {
  currentSite?: Site;
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
