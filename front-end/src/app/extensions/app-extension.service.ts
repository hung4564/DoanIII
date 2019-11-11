import { Injectable } from '@angular/core';
import {
  ExtensionService,
  ExtensionRef,
  ExtensionConfig,
  DocumentListPresetRef,
  ExtensionLoaderService,
  ContentActionRef,
  reduceEmptyMenus,
  reduceSeparators,
  sortByOrder,
  ContentActionType,
  RuleContext,
  SelectionState,
  NavigationState,
  ProfileState,
  RuleEvaluator,
  IconRef
} from '@alfresco/adf-extensions';
import { Observable, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppConfigService, AuthenticationService } from '@alfresco/adf-core';
import { RepositoryInfo } from '@alfresco/js-api';
import { NodePermissionService } from 'app/services/node-permission.service';
import { AppStore } from 'app/store/states/app.state';
import { getRuleContext } from 'app/store/selectors/app.selector';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class AppExtensionService implements RuleContext {
  documentListPresets: {
    files: Array<DocumentListPresetRef>;
    libraries: Array<DocumentListPresetRef>;
    favoriteLibraries: Array<DocumentListPresetRef>;
    shared: Array<DocumentListPresetRef>;
    recent: Array<DocumentListPresetRef>;
    favorites: Array<DocumentListPresetRef>;
    trashcan: Array<DocumentListPresetRef>;
    searchLibraries: Array<DocumentListPresetRef>;
  } = {
    files: [],
    libraries: [],
    favoriteLibraries: [],
    shared: [],
    recent: [],
    favorites: [],
    trashcan: [],
    searchLibraries: []
  };

  toolbarActions: Array<ContentActionRef> = [];
  viewerToolbarActions: Array<ContentActionRef> = [];
  contextMenuActions: Array<ContentActionRef> = [];
  createActions: Array<ContentActionRef> = [];

  selection: SelectionState;
  navigation: NavigationState;
  profile: ProfileState;
  repository: RepositoryInfo;

  private _references = new BehaviorSubject<ExtensionRef[]>([]);
  references$: Observable<ExtensionRef[]>;

  constructor(
    public auth: AuthenticationService,
    protected store: Store<AppStore>,
    protected appConfig: AppConfigService,
    protected loader: ExtensionLoaderService,
    protected extensions: ExtensionService,
    protected matIconRegistry: MatIconRegistry,
    public permissions: NodePermissionService,
    protected sanitizer: DomSanitizer
  ) {
    this.references$ = this._references.asObservable();
    this.store.select(getRuleContext).subscribe(result => {
      this.selection = result.selection;
      this.navigation = result.navigation;
      this.profile = result.profile;
      this.repository = result.repository;
    });
  }
  async load() {
    const config = await this.extensions.load();
    this.setup(config);
  }
  setup(config: ExtensionConfig) {
    if (!config) {
      console.error('Extension configuration not found');
      return;
    }
    this.toolbarActions = this.loader.getContentActions(config, 'features.toolbar');
    this.viewerToolbarActions = this.loader.getContentActions(
      config,
      'features.viewer.toolbarActions'
    );
    this.createActions = this.loader.getElements<ContentActionRef>(config, 'features.create');
    this.contextMenuActions = this.loader.getContentActions(config, 'features.contextMenu');

    this.documentListPresets = {
      files: this.getDocumentListPreset(config, 'files'),
      libraries: this.getDocumentListPreset(config, 'libraries'),
      favoriteLibraries: this.getDocumentListPreset(config, 'favoriteLibraries'),
      shared: this.getDocumentListPreset(config, 'shared'),
      recent: this.getDocumentListPreset(config, 'recent'),
      favorites: this.getDocumentListPreset(config, 'favorites'),
      trashcan: this.getDocumentListPreset(config, 'trashcan'),
      searchLibraries: this.getDocumentListPreset(config, 'search-libraries')
    };

    this.registerIcons(config);
    const references = (config.$references || [])
      .filter(entry => typeof entry === 'object')
      .map(entry => <ExtensionRef>entry);
    this._references.next(references);
  }
  /**
   * Provides a collection of document list columns for the particular preset.
   * The result is filtered by the **disabled** state.
   * @param key Preset key.
   */
  protected getDocumentListPreset(config: ExtensionConfig, key: string) {
    return this.loader
      .getElements<DocumentListPresetRef>(config, `features.documentList.${key}`)
      .filter(entry => !entry.disabled);
  }
  getCreateActions(): Array<ContentActionRef> {
    return this.createActions
      .filter(action => this.filterVisible(action))
      .map(action => this.copyAction(action))
      .map(action => this.buildMenu(action))
      .map(action => {
        let disabled = false;

        if (action.rules && action.rules.enabled) {
          disabled = !this.extensions.evaluateRule(action.rules.enabled, this);
        }

        return {
          ...action,
          disabled
        };
      });
  }
  private buildMenu(actionRef: ContentActionRef): ContentActionRef {
    if (
      actionRef.type === ContentActionType.menu &&
      actionRef.children &&
      actionRef.children.length > 0
    ) {
      const children = actionRef.children
        .filter(action => this.filterVisible(action))
        .map(action => this.buildMenu(action));

      actionRef.children = children
        .map(action => {
          let disabled = false;

          if (action.rules && action.rules.enabled) {
            disabled = !this.extensions.evaluateRule(action.rules.enabled, this);
          }

          return {
            ...action,
            disabled
          };
        })
        .sort(sortByOrder)
        .reduce(reduceEmptyMenus, [])
        .reduce(reduceSeparators, []);
    }

    return actionRef;
  }
  getAllowedToolbarActions(): Array<ContentActionRef> {
    return this.getAllowedActions(this.toolbarActions);
  }

  getViewerToolbarActions(): Array<ContentActionRef> {
    return this.getAllowedActions(this.viewerToolbarActions);
  }
  getAllowedContextMenuActions(): Array<ContentActionRef> {
    return this.getAllowedActions(this.contextMenuActions);
  }
  private getAllowedActions(actions: ContentActionRef[]): ContentActionRef[] {
    return (actions || [])
      .filter(action => this.filterVisible(action))
      .map(action => {
        if (action.type === ContentActionType.menu) {
          const copy = this.copyAction(action);
          if (copy.children && copy.children.length > 0) {
            copy.children = copy.children
              .filter(entry => !entry.disabled)
              .filter(childAction => this.filterVisible(childAction))
              .sort(sortByOrder)
              .reduce(reduceSeparators, []);
          }
          return copy;
        }
        return action;
      })
      .reduce(reduceEmptyMenus, [])
      .reduce(reduceSeparators, []);
  }

  copyAction(action: ContentActionRef): ContentActionRef {
    return {
      ...action,
      children: (action.children || []).map(child => this.copyAction(child))
    };
  }
  filterVisible(action: ContentActionRef): boolean {
    if (action && action.rules && action.rules.visible) {
      return this.extensions.evaluateRule(action.rules.visible, this);
    }
    return true;
  }
  getEvaluator(key: string): RuleEvaluator {
    return this.extensions.getEvaluator(key);
  }
  runActionById(id: string) {
    console.log('TCL: AppExtensionService -> runActionById -> id', id);
    const action = this.extensions.getActionById(id);
    console.log('TCL: AppExtensionService -> runActionById -> action', action);
    if (action) {
      const { type, payload } = action;
      const context = {
        selection: this.selection
      };
      const expression = this.extensions.runExpression(payload, context);

      this.store.dispatch({ type, payload: expression });
    } else {
      this.store.dispatch({ type: id });
    }
  }
  protected registerIcons(config: ExtensionConfig) {
    const icons: Array<IconRef> = this.loader
      .getElements<IconRef>(config, 'features.icons')
      .filter(entry => !entry.disabled);

    for (const icon of icons) {
      const [ns, id] = icon.id.split(':');
      const value = icon.value;

      if (!value) {
        console.warn(`Missing icon value for "${icon.id}".`);
      } else if (!ns || !id) {
        console.warn(`Incorrect icon id format: "${icon.id}".`);
      } else {
        this.matIconRegistry.addSvgIconInNamespace(
          ns,
          id,
          this.sanitizer.bypassSecurityTrustResourceUrl(value)
        );
      }
    }
  }
}
