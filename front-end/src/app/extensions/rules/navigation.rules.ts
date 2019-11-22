import { CustomRuleContext, NavigationTypeEnum } from "app/model/custom-rule-context.model";

/**
 * Checks if a Preview route is activated.
 * JSON ref: `app.navigation.isDisableShowByType`
 */

export function isDisableShowByType(
  context: CustomRuleContext,
  type: { type: string; value: NavigationTypeEnum }
): boolean {
  const { data } = context.navigation;
  if (type.value && data && data[type.value]) return false;
  return true;
}
/**
 * Checks if a Preview route is activated.
 * JSON ref: `app.navigation.isShowInfo`
 */
export function isShowInfo(context: CustomRuleContext): boolean {
  const { data } = context.navigation;
  if (data && data.disableShowInfoFile) return false;
  return true;
}
/**
 * Checks if a Preview route is activated.
 * JSON ref: `app.navigation.isPreview`
 */
export function isPreview(context: CustomRuleContext): boolean {
  const { url } = context.navigation;
  return url && (url.includes("viewer:view") || url.includes("/view/"));
}

/**
 * Checks if a **Favorites** route is activated.
 * JSON ref: `app.navigation.isFavorites`
 */
export function isFavorites(context: CustomRuleContext): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/favorites") && !isPreview(context);
}

/**
 * Checks if the activated route is not **Favorites**.
 * JSON ref: `app.navigation.isNotFavorites`
 */
export function isNotFavorites(context: CustomRuleContext): boolean {
  return !isFavorites(context);
}

/**
 * Checks if a **Shared Files** route is activated.
 * JSON ref: `app.navigation.isSharedFiles`
 */
export function isSharedFiles(context: CustomRuleContext): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/shared") && !isPreview(context);
}

/**
 * Checks if the activated route is not **Shared Files**.
 * JSON ref: `app.navigation.isNotSharedFiles`
 */
export function isNotSharedFiles(context: CustomRuleContext): boolean {
  return !isSharedFiles(context);
}

/**
 * Checks if a **Trashcan** route is activated.
 * JSON ref: `app.navigation.isTrashcan`
 */
export function isTrashcan(context: CustomRuleContext): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/trashcan");
}

/**
 * Checks if the activated route is not **Trashcan**.
 * JSON ref: `app.navigation.isNotTrashcan`
 */
export function isNotTrashcan(context: CustomRuleContext): boolean {
  return !isTrashcan(context);
}

/**
 * Checks if a **Personal Files** route is activated.
 * JSON ref: `app.navigation.isPersonalFiles`
 */
export function isPersonalFiles(context: CustomRuleContext): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/personal-files");
}

/**
 * Checks if a **Library Files** route is activated.
 * JSON ref: `app.navigation.isLibraryFiles`
 */
export function isLibraryFiles(context: CustomRuleContext): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/libraries");
}

/**
 * Checks if a **Library Files** or **Library Search Result** route is activated.
 * JSON ref: `app.navigation.isLibraryFiles`
 */
export function isLibraries(context: CustomRuleContext): boolean {
  const { url } = context.navigation;
  return url && (url.endsWith("/libraries") || url.startsWith("/search-libraries"));
}

/**
 * Checks if the activated route is neither **Libraries** nor **Library Search Results**.
 * JSON ref: `app.navigation.isNotLibraries`
 */
export function isNotLibraries(context: CustomRuleContext): boolean {
  return !isLibraries(context);
}

/**
 * Checks if a **Recent Files** route is activated.
 * JSON ref: `app.navigation.isRecentFiles`
 */
export function isRecentFiles(context: CustomRuleContext): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/recent-files");
}

/**
 * Checks if the activated route is not **Recent Files**.
 * JSON ref: `app.navigation.isNotRecentFiles`
 */
export function isNotRecentFiles(context: CustomRuleContext): boolean {
  return !isRecentFiles(context);
}

/**
 * Checks if a **Search Results** route is activated.
 * JSON ref: `app.navigation.isSearchResults`
 */
export function isSearchResults(
  context: CustomRuleContext /*,
  ...args: RuleParameter[]*/
): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/search");
}

/**
 * Checks if the activated route is not **Search Results**.
 * JSON ref: `app.navigation.isNotSearchResults`
 */
export function isNotSearchResults(context: CustomRuleContext): boolean {
  return !isSearchResults(context);
}

/**
 * Checks if a **Shared Preview** route is activated.
 * JSON ref: `app.navigation.isSharedPreview`
 */
export function isSharedPreview(context: CustomRuleContext): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/shared") && url.includes("viewer:view");
}

/**
 * Checks if a **Favorites Preview** route is activated.
 * JSON ref: `app.navigation.isFavoritesPreview`
 */
export function isFavoritesPreview(context: CustomRuleContext): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/favorites") && url.includes("viewer:view");
}

/**
 * Checks if a **Shared File Preview** route is activated.
 * JSON ref: `app.navigation.isFavoritesPreview`
 */
export function isSharedFileViewer(context: CustomRuleContext): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/preview/s/");
}

/**
 * Checks if a **People** route is activated.
 * JSON ref: `app.navigation.isPeople`
 */
export function isPeople(context: CustomRuleContext): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/people");
}

/**
 * Checks if the activated route is not **People**.
 * JSON ref: `app.navigation.isNotPeople`
 */
export function isNotPeople(context: CustomRuleContext): boolean {
  return !isPeople(context);
}

/**
 * Checks if a **Group** route is activated.
 * JSON ref: `app.navigation.isGroup`
 */
export function isGroup(context: CustomRuleContext): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/groups");
}

/**
 * Checks if the activated route is not **Group**.
 * JSON ref: `app.navigation.isNotGroup`
 */
export function isNotGroup(context: CustomRuleContext): boolean {
  return !isGroup(context);
}

/**
 * Checks if a **Task** route is activated.
 * JSON ref: `app.navigation.isTask`
 */
export function isTask(context: CustomRuleContext): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/tasks");
}

/**
 * Checks if the activated route is not **Task**.
 * JSON ref: `app.navigation.isNotTask`
 */
export function isNotTask(context: CustomRuleContext): boolean {
  return !isTask(context);
}

/**
 * Checks if the activated route is not **Task**.
 * JSON ref: `app.navigation.isLibraryMember`
 */
export function isLibraryMember(context: CustomRuleContext): boolean {
  const { url } = context.navigation;
  console.log("TCL: url", url)
  return url && url.startsWith("/libraries") && url.includes("members");
}

/**
 * Checks if the activated route is not **Task**.
 * JSON ref: `app.navigation.isNotLibraryMember`
 */
export function isNotLibraryMember(context: CustomRuleContext): boolean {
  return !isLibraryMember(context);
}
