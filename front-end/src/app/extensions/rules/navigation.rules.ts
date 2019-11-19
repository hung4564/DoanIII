import { RuleContext } from "@alfresco/adf-extensions";

/**
 * Checks if a Preview route is activated.
 * JSON ref: `app.navigation.isPreview`
 */
export function isPreview(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url && (url.includes("viewer:view") || url.includes("/view/"));
}

/**
 * Checks if a **Favorites** route is activated.
 * JSON ref: `app.navigation.isFavorites`
 */
export function isFavorites(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/favorites") && !isPreview(context);
}

/**
 * Checks if the activated route is not **Favorites**.
 * JSON ref: `app.navigation.isNotFavorites`
 */
export function isNotFavorites(context: RuleContext): boolean {
  return !isFavorites(context);
}

/**
 * Checks if a **Shared Files** route is activated.
 * JSON ref: `app.navigation.isSharedFiles`
 */
export function isSharedFiles(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/shared") && !isPreview(context);
}

/**
 * Checks if the activated route is not **Shared Files**.
 * JSON ref: `app.navigation.isNotSharedFiles`
 */
export function isNotSharedFiles(context: RuleContext): boolean {
  return !isSharedFiles(context);
}

/**
 * Checks if a **Trashcan** route is activated.
 * JSON ref: `app.navigation.isTrashcan`
 */
export function isTrashcan(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/trashcan");
}

/**
 * Checks if the activated route is not **Trashcan**.
 * JSON ref: `app.navigation.isNotTrashcan`
 */
export function isNotTrashcan(context: RuleContext): boolean {
  return !isTrashcan(context);
}

/**
 * Checks if a **Personal Files** route is activated.
 * JSON ref: `app.navigation.isPersonalFiles`
 */
export function isPersonalFiles(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/personal-files");
}

/**
 * Checks if a **Library Files** route is activated.
 * JSON ref: `app.navigation.isLibraryFiles`
 */
export function isLibraryFiles(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/libraries");
}

/**
 * Checks if a **Library Files** or **Library Search Result** route is activated.
 * JSON ref: `app.navigation.isLibraryFiles`
 */
export function isLibraries(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url && (url.endsWith("/libraries") || url.startsWith("/search-libraries"));
}

/**
 * Checks if the activated route is neither **Libraries** nor **Library Search Results**.
 * JSON ref: `app.navigation.isNotLibraries`
 */
export function isNotLibraries(context: RuleContext): boolean {
  return !isLibraries(context);
}

/**
 * Checks if a **Recent Files** route is activated.
 * JSON ref: `app.navigation.isRecentFiles`
 */
export function isRecentFiles(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/recent-files");
}

/**
 * Checks if the activated route is not **Recent Files**.
 * JSON ref: `app.navigation.isNotRecentFiles`
 */
export function isNotRecentFiles(context: RuleContext): boolean {
  return !isRecentFiles(context);
}

/**
 * Checks if a **Search Results** route is activated.
 * JSON ref: `app.navigation.isSearchResults`
 */
export function isSearchResults(context: RuleContext /*,
  ...args: RuleParameter[]*/): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/search");
}

/**
 * Checks if the activated route is not **Search Results**.
 * JSON ref: `app.navigation.isNotSearchResults`
 */
export function isNotSearchResults(context: RuleContext): boolean {
  return !isSearchResults(context);
}

/**
 * Checks if a **Shared Preview** route is activated.
 * JSON ref: `app.navigation.isSharedPreview`
 */
export function isSharedPreview(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/shared") && url.includes("viewer:view");
}

/**
 * Checks if a **Favorites Preview** route is activated.
 * JSON ref: `app.navigation.isFavoritesPreview`
 */
export function isFavoritesPreview(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/favorites") && url.includes("viewer:view");
}

/**
 * Checks if a **Shared File Preview** route is activated.
 * JSON ref: `app.navigation.isFavoritesPreview`
 */
export function isSharedFileViewer(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/preview/s/");
}

/**
 * Checks if a **People** route is activated.
 * JSON ref: `app.navigation.isPeople`
 */
export function isPeople(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/people");
}

/**
 * Checks if the activated route is not **People**.
 * JSON ref: `app.navigation.isNotPeople`
 */
export function isNotPeople(context: RuleContext): boolean {
  return !isPeople(context);
}

/**
 * Checks if a **Group** route is activated.
 * JSON ref: `app.navigation.isGroup`
 */
export function isGroup(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/groups");
}

/**
 * Checks if the activated route is not **Group**.
 * JSON ref: `app.navigation.isNotGroup`
 */
export function isNotGroup(context: RuleContext): boolean {
  return !isGroup(context);
}

/**
 * Checks if a **Task** route is activated.
 * JSON ref: `app.navigation.isTask`
 */
export function isTask(context: RuleContext): boolean {
  const { url } = context.navigation;
  return url && url.startsWith("/tasks");
}

/**
 * Checks if the activated route is not **Task**.
 * JSON ref: `app.navigation.isNotTask`
 */
export function isNotTask(context: RuleContext): boolean {
  return !isTask(context);
}
