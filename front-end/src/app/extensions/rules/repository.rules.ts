import { CustomRuleContext } from "app/model/custom-rule-context.model";
import { Site } from "@alfresco/js-api";

/**
 * Checks if the quick share repository option is enabled or not.
 * JSON ref: `repository.isQuickShareEnabled`
 */
export function hasQuickShareEnabled(context: CustomRuleContext): boolean {
  return context.repository.status.isQuickShareEnabled;
}

/**
 * Checks if can remove member of library repository option is enabled or not.
 * JSON ref: `repository.canRemoveLibraryMember`
 */
export function canRemoveLibraryMember(context: CustomRuleContext): boolean {
  const site: Site = context.navigation["currentSite"];
  if (site && site.role == Site.RoleEnum.SiteManager) {
    return true;
  }
  return false;
}

/**
 * Checks if can remove member of library repository option is enabled or not.
 * JSON ref: `repository.canAddLibraryMember`
 */
export function canAddLibraryMember(context: CustomRuleContext): boolean {
  const site: Site = context.navigation["currentSite"];
  if (site && site.role == Site.RoleEnum.SiteManager) {
    return true;
  }
  return false;
}
/**
 * Checks if can update member of library repository option is enabled or not.
 * JSON ref: `repository.canUpadteLibraryMember`
 */
export function canUpadteLibraryMember(context: CustomRuleContext): boolean {
  const site: Site = context.navigation["currentSite"];
  if (site && site.role == Site.RoleEnum.SiteManager) {
    return true;
  }
  return false;
}
