import { Site } from "@alfresco/js-api";
import {
  CustomRuleContext,
  NavigationTypeEnum
} from "app/model/custom-rule-context.model";
import * as navigation from "./navigation.rules";
import * as repository from "./repository.rules";
import * as user from "./user.rules";

/**
 * Checks if user can copy selected node.
 * JSON ref: `app.canCopyNode`
 * @param context Rule execution context
 */
export function canCopyNode(context: CustomRuleContext): boolean {
  return [
    hasSelection(context),
    navigation.isNotTrashcan(context),
    navigation.isNotLibraries(context),
    navigation.isNotPeople(context),
    navigation.isNotGroup(context),
    navigation.isDisableShowByType(context, {
      type: "type",
      value: NavigationTypeEnum.disableCopyNode
    })
  ].every(Boolean);
}

/**
 * Checks if user can mark selected nodes as **Favorite**.
 * JSON ref: `app.selection.canAddFavorite`
 */
export function canAddFavorite(context: CustomRuleContext): boolean {
  if (!context.selection.isEmpty) {
    if (
      navigation.isFavorites(context) ||
      navigation.isLibraries(context) ||
      navigation.isTrashcan(context)
    ) {
      return false;
    }
    return context.selection.nodes.some(node => !node.entry.isFavorite);
  }
  return false;
}

/**
 * Checks if user can un-mark selected nodes as **Favorite**.
 * JSON ref: `app.selection.canRemoveFavorite`
 */
export function canRemoveFavorite(context: CustomRuleContext): boolean {
  if (!context.selection.isEmpty && !navigation.isTrashcan(context)) {
    if (navigation.isFavorites(context)) {
      return true;
    }
    return context.selection.nodes.every(node => node.entry.isFavorite);
  }
  return false;
}

/**
 * Checks if user can share selected file.
 * JSON ref: `app.selection.file.canShare`
 */
export function canShareFile(context: CustomRuleContext): boolean {
  return [
    context.selection.file,
    navigation.isNotTrashcan(context),
    repository.hasQuickShareEnabled(context),
    !isShared(context)
  ].every(Boolean);
}

/**
 * Checks if user can perform "Join" or "Cancel Join Request" on a library.
 * JSON ref: `canToggleJoinLibrary`
 */
export function canToggleJoinLibrary(context: CustomRuleContext): boolean {
  return [
    hasLibrarySelected(context),
    !isPrivateLibrary(context),
    hasNoLibraryRole(context)
  ].every(Boolean);
}

/**
 * Checks if user can edit the selected folder.
 * JSON ref: `canEditFolder`
 * @param context Rule execution context
 */
export function canEditFolder(context: CustomRuleContext): boolean {
  return [
    canUpdateSelectedFolder(context),
    navigation.isNotTrashcan(context)
  ].every(Boolean);
}

/**
 * Checks if the selected file is already shared.
 * JSON ref: `app.selection.file.isShared`
 */
export function isShared(context: CustomRuleContext): boolean {
  if (navigation.isSharedFiles(context) && context.selection.file) {
    return true;
  }

  if (
    (navigation.isNotTrashcan(context),
    !context.selection.isEmpty && context.selection.file)
  ) {
    return !!(
      context.selection.file.entry &&
      context.selection.file.entry.properties &&
      context.selection.file.entry.properties["qshare:sharedId"]
    );
  }

  return false;
}

/**
 * Checks if user can delete selected nodes.
 * JSON ref: `app.selection.canDelete`
 */
export function canDeleteSelection(context: CustomRuleContext): boolean {
  if (
    navigation.isNotTrashcan(context) &&
    navigation.isNotLibraries(context) &&
    navigation.isNotSearchResults(context) &&
    !context.selection.isEmpty
  ) {
    if (hasLockedFiles(context)) {
      return false;
    }

    if (navigation.isFavorites(context)) {
      return true;
    }

    if (navigation.isPreview(context)) {
      return context.permissions.check(context.selection.nodes, ["delete"]);
    }

    if (navigation.isSharedFiles(context)) {
      return context.permissions.check(context.selection.nodes, ["delete"], {
        target: "allowableOperationsOnTarget"
      });
    }

    return context.permissions.check(context.selection.nodes, ["delete"]);
  }
  return false;
}

/**
 * Checks if user can un-share selected nodes.
 * JSON ref: `app.selection.canUnshare`
 */
export function canUnshareNodes(context: CustomRuleContext): boolean {
  if (!context.selection.isEmpty) {
    return context.permissions.check(context.selection.nodes, ["delete"], {
      target: "allowableOperationsOnTarget"
    });
  }
  return false;
}

/**
 * Checks if user selected anything.
 * JSON ref: `app.selection.notEmpty`
 */
export function hasSelection(context: CustomRuleContext): boolean {
  return !context.selection.isEmpty;
}

/**
 * Checks if user can create a new folder with current path.
 * JSON ref: `app.navigation.folder.canCreate`
 */
export function canCreateFolder(context: CustomRuleContext): boolean {
  const { currentFolder } = context.navigation;
  if (currentFolder) {
    return context.permissions.check(currentFolder, ["create"]);
  }
  return false;
}

/**
 * Checks if user can upload content to current folder.
 * JSON ref: `app.navigation.folder.canUpload`
 */
export function canUpload(context: CustomRuleContext): boolean {
  const { currentFolder } = context.navigation;
  if (currentFolder) {
    return context.permissions.check(currentFolder, ["create"]);
  }
  return false;
}

/**
 * Checks if user can download selected nodes (either files or folders).
 * JSON ref: `app.selection.canDownload`
 */
export function canDownloadSelection(context: CustomRuleContext): boolean {
  if (!context.selection.isEmpty && navigation.isNotTrashcan(context)) {
    return context.selection.nodes.every((node: any) => {
      return (
        node.entry &&
        (node.entry.isFile || node.entry.isFolder || !!node.entry.nodeId)
      );
    });
  }
  return false;
}

/**
 * Checks if user has selected a folder.
 * JSON ref: `app.selection.folder`
 */
export function hasFolderSelected(context: CustomRuleContext): boolean {
  const folder = context.selection.folder;
  return folder ? true : false;
}

/**
 * Checks if user has selected a library (site).
 * JSON ref: `app.selection.library`
 */
export function hasLibrarySelected(context: CustomRuleContext): boolean {
  const library = context.selection.library;
  return library ? true : false;
}

/**
 * Checks if user has selected a **private** library (site)
 * JSON ref: `app.selection.isPrivateLibrary`
 */
export function isPrivateLibrary(context: CustomRuleContext): boolean {
  const library = context.selection.library;
  return library
    ? !!(
        library.entry &&
        library.entry.visibility &&
        library.entry.visibility === "PRIVATE"
      )
    : false;
}

/**
 * Checks if the selected library has a **role** property defined.
 * JSON ref: `app.selection.hasLibraryRole`
 */
export function hasLibraryRole(context: CustomRuleContext): boolean {
  const library = context.selection.library;
  return library ? !!(library.entry && library.entry.role) : false;
}

/**
 * Checks if the selected library has no **role** property defined.
 * JSON ref: `app.selection.hasNoLibraryRole`
 */
export function hasNoLibraryRole(context: CustomRuleContext): boolean {
  return !hasLibraryRole(context);
}

/**
 * Checks if user has selected a file.
 * JSON ref: `app.selection.file`
 */
export function hasFileSelected(context: CustomRuleContext): boolean {
  if (context && context.selection && context.selection.file) {
    return true;
  }
  return false;
}

/**
 * Checks if user can update the first selected node.
 * JSON ref: `app.selection.first.canUpdate`
 */
export function canUpdateSelectedNode(context: CustomRuleContext): boolean {
  if (context.selection && !context.selection.isEmpty) {
    const node = context.selection.first;

    if (node.entry.isFile && hasLockedFiles(context)) {
      return false;
    }

    return context.permissions.check(node, ["update"]);
  }
  return false;
}

/**
 * Checks if user can update the first selected folder.
 * JSON ref: `app.selection.folder.canUpdate`
 */
export function canUpdateSelectedFolder(context: CustomRuleContext): boolean {
  const { folder } = context.selection;
  if (folder) {
    return (
      navigation.isFavorites(context) ||
      context.permissions.check(folder.entry, ["update"])
    );
  }
  return false;
}

/**
 * Checks if user has selected a **locked** file node.
 * JSON ref: `app.selection.file.isLocked`
 */
export function hasLockedFiles(context: CustomRuleContext): boolean {
  if (context && context.selection && context.selection.nodes) {
    return context.selection.nodes.some(node => {
      if (!node.entry.isFile) {
        return false;
      }

      return (
        node.entry.isLocked ||
        (node.entry.properties &&
          node.entry.properties["cm:lockType"] === "READ_ONLY_LOCK")
      );
    });
  }

  return false;
}

/**
 * Checks if the selected file has **write** or **read-only** locks specified.
 * JSON ref: `app.selection.file.isLocked`
 */
export function isWriteLocked(context: CustomRuleContext): boolean {
  return !!(
    context &&
    context.selection &&
    context.selection.file &&
    context.selection.file.entry &&
    context.selection.file.entry.properties &&
    (context.selection.file.entry.properties["cm:lockType"] === "WRITE_LOCK" ||
      context.selection.file.entry.properties["cm:lockType"] ===
        "READ_ONLY_LOCK")
  );
}

/**
 * Checks if the selected file has **write** or **read-only** locks specified,
 * and that current user is the owner of the lock.
 * JSON ref: `app.selection.file.isLockOwner`
 */
export function isUserWriteLockOwner(context: CustomRuleContext): boolean {
  return (
    isWriteLocked(context) &&
    context.selection.file.entry.properties["cm:lockOwner"] &&
    context.selection.file.entry.properties["cm:lockOwner"].id ===
      context.profile.id
  );
}

/**
 * Checks if user can lock selected file.
 * JSON ref: `app.selection.file.canLock`
 */
export function canLockFile(context: CustomRuleContext): boolean {
  return !isWriteLocked(context) && canUpdateSelectedNode(context);
}

/**
 * Checks if user can unlock selected file.
 * JSON ref: `app.selection.file.canLock`
 */
export function canUnlockFile(context: CustomRuleContext): boolean {
  const { file } = context.selection;
  return (
    isWriteLocked(context) &&
    (context.permissions.check(file.entry, ["delete"]) ||
      isUserWriteLockOwner(context))
  );
}

/**
 * Checks if user can upload a new version of the file.
 * JSON ref: `app.selection.file.canUploadVersion`
 */
export function canUploadVersion(context: CustomRuleContext): boolean {
  if (navigation.isFavorites(context) || navigation.isSharedFiles(context)) {
    return hasFileSelected(context);
  }

  return [
    hasFileSelected(context),
    navigation.isNotTrashcan(context),
    isWriteLocked(context)
      ? isUserWriteLockOwner(context)
      : canUpdateSelectedNode(context)
  ].every(Boolean);
}

/**
 * Checks if user has trashcan item selected.
 * JSON ref: `isTrashcanItemSelected`
 * @param context Rule execution context
 */
export function isTrashcanItemSelected(context: CustomRuleContext): boolean {
  return [navigation.isTrashcan(context), hasSelection(context)].every(Boolean);
}

/**
 * Checks if user can view the file.
 * JSON ref: `canViewFile`
 * @param context Rule execution context
 */
export function canViewFile(context: CustomRuleContext): boolean {
  return [hasFileSelected(context), navigation.isNotTrashcan(context)].every(
    Boolean
  );
}

/**
 * Checks if user can **Leave** selected library.
 * JSON ref: `canLeaveLibrary`
 * @param context Rule execution context
 */
export function canLeaveLibrary(context: CustomRuleContext): boolean {
  return [hasLibrarySelected(context), hasLibraryRole(context)].every(Boolean);
}

/**
 * Checks if user can toggle shared link mode.
 * JSON ref: `canToggleSharedLink`
 * @param context Rule execution context
 */
export function canToggleSharedLink(context: CustomRuleContext): boolean {
  return [
    hasFileSelected(context),
    [canShareFile(context), isShared(context)].some(Boolean)
  ].every(Boolean);
}

/**
 * Checks if user can show **Info Drawer** for the selected node.
 * JSON ref: `canShowInfoDrawer`
 * @param context Rule execution context
 */
export function canShowInfoDrawer(context: CustomRuleContext): boolean {
  return [
    hasSelection(context),
    navigation.isNotLibraries(context),
    navigation.isNotTrashcan(context),
    navigation.isShowInfo(context)
  ].every(Boolean);
}

/**
 * Checks if user can manage file versions for the selected node.
 * JSON ref: `canManageFileVersions`
 * @param context Rule execution context
 */
export function canManageFileVersions(context: CustomRuleContext): boolean {
  return [
    hasFileSelected(context),
    navigation.isNotTrashcan(context),
    !hasLockedFiles(context)
  ].every(Boolean);
}

/**
 * Checks if user can manage permissions for the selected node.
 * JSON ref: `canManagePermissions`
 * @param context Rule execution context
 */
export function canManagePermissions(context: CustomRuleContext): boolean {
  return [
    canUpdateSelectedNode(context),
    navigation.isNotTrashcan(context)
  ].every(Boolean);
}

/**
 * Checks if user can toggle **Edit Offline** mode for selected node.
 * JSON ref: `canToggleEditOffline`
 * @param context Rule execution context
 */
export function canToggleEditOffline(context: CustomRuleContext): boolean {
  return [
    hasFileSelected(context),
    navigation.isNotTrashcan(context),
    navigation.isNotFavorites(context) ||
      navigation.isFavoritesPreview(context),
    navigation.isNotSharedFiles(context) || navigation.isSharedPreview(context),
    canLockFile(context) || canUnlockFile(context)
  ].every(Boolean);
}

/**
 * @deprecated Uses workarounds for for recent files and search api issues.
 * Checks if user can toggle **Favorite** state for a node.
 * @param context Rule execution context
 */
export function canToggleFavorite(context: CustomRuleContext): boolean {
  return [
    [canAddFavorite(context), canRemoveFavorite(context)].some(Boolean),
    [
      navigation.isRecentFiles(context),
      navigation.isSharedFiles(context),
      navigation.isSearchResults(context),
      navigation.isFavorites(context)
    ].some(Boolean)
  ].every(Boolean);
}

/**
 * Checks if user can show **Info Drawer** for the selected node.
 * JSON ref: `canShowPeople`
 * @param context Rule execution context
 */
export function canShowPeople(context: CustomRuleContext): boolean {
  return [
    hasSelection(context),
    navigation.isPeople(context),
    user.isAdmin(context)
  ].every(Boolean);
}

/**
 * Checks if user can show **Info Drawer** for the selected node.
 * JSON ref: `canShowGroup`
 * @param context Rule execution context
 */
export function canShowGroup(context: CustomRuleContext): boolean {
  return [
    hasSelection(context),
    navigation.isGroup(context),
    user.isAdmin(context)
  ].every(Boolean);
}

/**
 * Checks if user can delete the first selected library.
 * JSON ref: `app.selection.library.canDelete`
 */
export function canDeleteSelectedLibrary(context: CustomRuleContext): boolean {
  const { library } = context.selection;
  if (library) {
    return library && library.entry.role == Site.RoleEnum.SiteManager;
  }
  return false;
}
