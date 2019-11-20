import { RuleContext } from "@alfresco/adf-extensions";
import { Site } from "@alfresco/js-api";

/**
 * Checks if the quick share repository option is enabled or not.
 * JSON ref: `repository.isQuickShareEnabled`
 */
export function hasQuickShareEnabled(context: RuleContext): boolean {
  return context.repository.status.isQuickShareEnabled;
}

/**
 * Checks if can remove member of library repository option is enabled or not.
 * JSON ref: `repository.canRemoveLibraryMember`
 */
export function canRemoveLibraryMember(context: RuleContext): boolean {
  const site: Site = context.navigation["currentSite"];
  console.log("TCL: site", site)
  if (site.role == Site.RoleEnum.SiteManager) {
    return true;
  }
  return false;
}
