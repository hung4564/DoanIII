import { CoreModule, AuthGuardEcm } from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { ExtensionsModule, ExtensionService } from '@alfresco/adf-extensions';
import { AppExtensionService } from './app-extension.service';
import * as rules from './rules';
import { CustomNameColumnComponent } from 'app/layout/shares/name-column/name-column.component';
import {
  LibraryNameColumnComponent,
  LibraryRoleColumnComponent,
  LibraryStatusColumnComponent,
  TrashcanNameColumnComponent
} from '@alfresco/adf-content-services';
import { LocationLinkComponent } from 'app/layout/shares/location-link/location-link.component';
import { ToggleFavoriteComponent } from 'app/layout/shares/toolbar/toggle-favorite/toggle-favorite.component';
import { ToggleFavoriteLibraryComponent } from 'app/layout/shares/toolbar/toggle-favorite-library/toggle-favorite-library.component';
import { ToggleJoinLibraryButtonComponent } from 'app/layout/shares/toolbar/toggle-join-library/toggle-join-library-button.component';
import { ToggleJoinLibraryMenuComponent } from 'app/layout/shares/toolbar/toggle-join-library/toggle-join-library-menu.component';
import { ToggleEditOfflineComponent } from 'app/layout/shares/toolbar/toggle-edit-offline/toggle-edit-offline.component';
export function setupExtensions(service: AppExtensionService): Function {
  return () => service.load();
}

@NgModule({
  imports: [CommonModule, CoreModule.forChild(), ExtensionsModule]
})
export class CoreExtensionsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreExtensionsModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: setupExtensions,
          deps: [AppExtensionService],
          multi: true
        }
      ]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: CoreExtensionsModule
    };
  }

  constructor(extensions: ExtensionService) {
    extensions.setComponents({
      // 'app.layout.main': AppLayoutComponent,
      // 'app.components.tabs.metadata': MetadataTabComponent,
      // 'app.components.tabs.library.metadata': LibraryMetadataTabComponent,
      // 'app.components.tabs.comments': CommentsTabComponent,
      // 'app.components.tabs.versions': VersionsTabComponent,
      // 'app.toolbar.toggleInfoDrawer': ToggleInfoDrawerComponent,
      'app.toolbar.toggleFavorite': ToggleFavoriteComponent,
      'app.toolbar.toggleFavoriteLibrary': ToggleFavoriteLibraryComponent,
      'app.toolbar.toggleJoinLibrary': ToggleJoinLibraryButtonComponent,
      // 'app.toolbar.cardView': DocumentDisplayModeComponent,
      'app.menu.toggleJoinLibrary': ToggleJoinLibraryMenuComponent,
      // 'app.shared-link.toggleSharedLink': ToggleSharedComponent,
      'app.columns.name': CustomNameColumnComponent,
      'app.columns.libraryName': LibraryNameColumnComponent,
      'app.columns.libraryRole': LibraryRoleColumnComponent,
      'app.columns.libraryStatus': LibraryStatusColumnComponent,
      'app.columns.trashcanName': TrashcanNameColumnComponent,
      'app.columns.location': LocationLinkComponent,
      'app.toolbar.toggleEditOffline': ToggleEditOfflineComponent
    });

    extensions.setAuthGuards({
      'app.auth': AuthGuardEcm
    });

    extensions.setEvaluators({
      canCopyNode: rules.canCopyNode,
      canToggleJoinLibrary: rules.canToggleJoinLibrary,
      canEditFolder: rules.canEditFolder,
      isTrashcanItemSelected: rules.isTrashcanItemSelected,
      canViewFile: rules.canViewFile,
      canLeaveLibrary: rules.canLeaveLibrary,
      canToggleSharedLink: rules.canToggleSharedLink,
      canShowInfoDrawer: rules.canShowInfoDrawer,
      canManageFileVersions: rules.canManageFileVersions,
      canManagePermissions: rules.canManagePermissions,
      canToggleEditOffline: rules.canToggleEditOffline,
      canToggleFavorite: rules.canToggleFavorite,

      'app.selection.canDelete': rules.canDeleteSelection,
      'app.selection.file.canUnlock': rules.canUnlockFile,
      'app.selection.file.canLock': rules.canLockFile,
      'app.selection.canDownload': rules.canDownloadSelection,
      'app.selection.notEmpty': rules.hasSelection,
      'app.selection.canUnshare': rules.canUnshareNodes,
      'app.selection.canAddFavorite': rules.canAddFavorite,
      'app.selection.canRemoveFavorite': rules.canRemoveFavorite,
      'app.selection.first.canUpdate': rules.canUpdateSelectedNode,
      'app.selection.file': rules.hasFileSelected,
      'app.selection.file.canShare': rules.canShareFile,
      'app.selection.file.isShared': rules.isShared,
      'app.selection.file.isLocked': rules.hasLockedFiles,
      'app.selection.file.isLockOwner': rules.isUserWriteLockOwner,
      'app.selection.file.canUploadVersion': rules.canUploadVersion,
      'app.selection.library': rules.hasLibrarySelected,
      'app.selection.isPrivateLibrary': rules.isPrivateLibrary,
      'app.selection.hasLibraryRole': rules.hasLibraryRole,
      'app.selection.hasNoLibraryRole': rules.hasNoLibraryRole,
      'app.selection.folder': rules.hasFolderSelected,
      'app.selection.folder.canUpdate': rules.canUpdateSelectedFolder,

      'app.navigation.folder.canCreate': rules.canCreateFolder,
      'app.navigation.folder.canUpload': rules.canUpload,
      'app.navigation.isTrashcan': rules.isTrashcan,
      'app.navigation.isNotTrashcan': rules.isNotTrashcan,
      'app.navigation.isLibraries': rules.isLibraries,
      'app.navigation.isLibraryFiles': rules.isLibraryFiles,
      'app.navigation.isPersonalFiles': rules.isPersonalFiles,
      'app.navigation.isNotLibraries': rules.isNotLibraries,
      'app.navigation.isSharedFiles': rules.isSharedFiles,
      'app.navigation.isNotSharedFiles': rules.isNotSharedFiles,
      'app.navigation.isFavorites': rules.isFavorites,
      'app.navigation.isNotFavorites': rules.isNotFavorites,
      'app.navigation.isRecentFiles': rules.isRecentFiles,
      'app.navigation.isNotRecentFiles': rules.isNotRecentFiles,
      'app.navigation.isSearchResults': rules.isSearchResults,
      'app.navigation.isNotSearchResults': rules.isNotSearchResults,
      'app.navigation.isPreview': rules.isPreview,
      'app.navigation.isSharedPreview': rules.isSharedPreview,
      'app.navigation.isFavoritesPreview': rules.isFavoritesPreview,
      'app.navigation.isSharedFileViewer': rules.isSharedFileViewer,

      'repository.isQuickShareEnabled': rules.hasQuickShareEnabled,
      'user.isAdmin': rules.isAdmin
    });
  }
}