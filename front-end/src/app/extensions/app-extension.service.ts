import { Injectable } from "@angular/core";
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
  SelectionState,
  NavigationState,
  ProfileState,
  RuleEvaluator,
  IconRef,
  NavBarGroupRef,
  SidebarTabRef,
  mergeObjects
} from "@alfresco/adf-extensions";
import { Observable, BehaviorSubject } from "rxjs";
import { Store } from "@ngrx/store";
import { AppConfigService, AuthenticationService } from "@alfresco/adf-core";
import { RepositoryInfo, NodeEntry } from "@alfresco/js-api";
import { NodePermissionService } from "app/services/node-permission.service";
import { getRuleContext } from "app/store/selectors/app.selector";
import { MatIconRegistry } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { CustomRuleContext } from "app/model/custom-rule-context.model";
export interface ViewerRules {
  canPreview?: string;
}

@Injectable({
  providedIn: "root"
})
export class AppExtensionService implements CustomRuleContext {
  documentListPresets: {
    files: Array<DocumentListPresetRef>;
    libraries: Array<DocumentListPresetRef>;
    favoriteLibraries: Array<DocumentListPresetRef>;
    shared: Array<DocumentListPresetRef>;
    recent: Array<DocumentListPresetRef>;
    favorites: Array<DocumentListPresetRef>;
    trashcan: Array<DocumentListPresetRef>;
    searchLibraries: Array<DocumentListPresetRef>;
    people: Array<DocumentListPresetRef>;
    groups: Array<DocumentListPresetRef>;
    tasks: Array<DocumentListPresetRef>;
    siteMembers: DocumentListPresetRef[];
    siteMembersRequest: DocumentListPresetRef[];
  } = {
    files: [],
    libraries: [],
    favoriteLibraries: [],
    shared: [],
    recent: [],
    favorites: [],
    trashcan: [],
    searchLibraries: [],
    people: [],
    groups: [],
    tasks: [],
    siteMembers: [],
    siteMembersRequest: []
  };

  contentMetadata: any;
  openWithActions: Array<ContentActionRef> = [];
  toolbarActions: Array<ContentActionRef> = [];
  viewerToolbarActions: Array<ContentActionRef> = [];
  contextMenuActions: Array<ContentActionRef> = [];
  createActions: Array<ContentActionRef> = [];
  navbar: Array<NavBarGroupRef> = [];
  sidebar: Array<SidebarTabRef> = [];
  sharedLinkViewerToolbarActions: Array<ContentActionRef> = [];
  viewerRules: ViewerRules = {};

  selection: SelectionState;
  navigation: NavigationState;
  profile: ProfileState;
  repository: RepositoryInfo;

  private _references = new BehaviorSubject<ExtensionRef[]>([]);
  references$: Observable<ExtensionRef[]>;

  constructor(
    public auth: AuthenticationService,
    protected store: Store<any>,
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
      console.error("Extension configuration not found");
      return;
    }
    this.openWithActions = this.loader.getContentActions(
      config,
      "features.viewer.openWith"
    );
    this.toolbarActions = this.loader.getContentActions(
      config,
      "features.toolbar"
    );
    this.viewerToolbarActions = this.loader.getContentActions(
      config,
      "features.viewer.toolbarActions"
    );
    this.sharedLinkViewerToolbarActions = this.loader.getContentActions(
      config,
      "features.viewer.shared.toolbarActions"
    );
    this.contentMetadata = this.loadContentMetadata(config);
    this.createActions = this.loader.getElements<ContentActionRef>(
      config,
      "features.create"
    );
    this.contextMenuActions = this.loader.getContentActions(
      config,
      "features.contextMenu"
    );
    this.navbar = this.loadNavBar(config);
    this.sidebar = this.loader.getElements<SidebarTabRef>(
      config,
      "features.sidebar"
    );
    this.documentListPresets = {
      files: this.getDocumentListPreset(config, "files"),
      libraries: this.getDocumentListPreset(config, "libraries"),
      favoriteLibraries: this.getDocumentListPreset(
        config,
        "favoriteLibraries"
      ),
      shared: this.getDocumentListPreset(config, "shared"),
      recent: this.getDocumentListPreset(config, "recent"),
      favorites: this.getDocumentListPreset(config, "favorites"),
      trashcan: this.getDocumentListPreset(config, "trashcan"),
      searchLibraries: this.getDocumentListPreset(config, "search-libraries"),
      people: this.getDocumentListPreset(config, "people"),
      groups: this.getDocumentListPreset(config, "groups"),
      tasks: this.getDocumentListPreset(config, "tasks"),
      siteMembers: this.getDocumentListPreset(config, "siteMembers"),
      siteMembersRequest: this.getDocumentListPreset(
        config,
        "siteMembersRequest"
      )
    };

    if (config.features && config.features.viewer) {
      this.viewerRules = <ViewerRules>(config.features.viewer["rules"] || {});
    }
    this.registerIcons(config);
    const references = (config.$references || [])
      .filter(entry => typeof entry === "object")
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
      .getElements<DocumentListPresetRef>(
        config,
        `features.documentList.${key}`
      )
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
            disabled = !this.extensions.evaluateRule(
              action.rules.enabled,
              this
            );
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
  runActionById(id: string, data?) {
    console.log("TCL: AppExtensionService -> runActionById -> data", data);
    console.log("TCL: AppExtensionService -> runActionById -> id", id);
    const action = this.extensions.getActionById(id);
    if (action) {
      const { type, payload } = action;
      const context = {
        selection: this.selection
      };
      const expression = this.extensions.runExpression(payload, context);

      this.store.dispatch({ type, payload: expression });
    } else {
      if (data) this.store.dispatch({ type: id, payload: data });
      else this.store.dispatch({ type: id });
    }
  }
  protected registerIcons(config: ExtensionConfig) {
    const icons: Array<IconRef> = this.loader
      .getElements<IconRef>(config, "features.icons")
      .filter(entry => !entry.disabled);

    for (const icon of icons) {
      const [ns, id] = icon.id.split(":");
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
  protected loadNavBar(config: ExtensionConfig): Array<NavBarGroupRef> {
    return this.loader.getElements<NavBarGroupRef>(config, "features.navbar");
  }
  getSidebarTabs(): Array<SidebarTabRef> {
    return this.sidebar.filter(action => this.filterVisible(<any>action));
  }
  getApplicationNavigation(elements) {
    return elements.map(group => {
      return {
        ...group,
        items: (group.items || [])
          .filter(entry => !entry.disabled)
          .filter(item => this.filterVisible(item))
          .sort(sortByOrder)
          .map(item => {
            if (item.children && item.children.length > 0) {
              item.children = item.children
                .filter(entry => !entry.disabled)
                .filter(child => this.filterVisible(child))
                .sort(sortByOrder)
                .map(child => {
                  if (child.component) {
                    return {
                      ...child
                    };
                  }

                  if (!child.click) {
                    const childRouteRef = this.extensions.getRouteById(
                      child.route
                    );
                    const childUrl = `/${
                      childRouteRef ? childRouteRef.path : child.route
                    }`;
                    return {
                      ...child,
                      url: childUrl
                    };
                  }

                  return {
                    ...child,
                    action: child.click
                  };
                });

              return {
                ...item
              };
            }

            if (item.component) {
              return { ...item };
            }

            if (!item.click) {
              const routeRef = this.extensions.getRouteById(item.route);
              const url = `/${routeRef ? routeRef.path : item.route}`;
              return {
                ...item,
                url
              };
            }

            return {
              ...item,
              action: item.click
            };
          })
          .reduce(reduceEmptyMenus, [])
      };
    });
  }
  canPreviewNode(node: NodeEntry) {
    const rules = this.viewerRules;

    if (this.isRuleDefined(rules.canPreview)) {
      const canPreview = this.evaluateRule(rules.canPreview, node);

      if (!canPreview) {
        return false;
      }
    }

    return true;
  }
  isRuleDefined(ruleId: string): boolean {
    return ruleId && this.getEvaluator(ruleId) ? true : false;
  }
  evaluateRule(ruleId: string, ...args: any[]): boolean {
    const evaluator = this.getEvaluator(ruleId);

    if (evaluator) {
      return evaluator(this, ...args);
    }

    return false;
  }
  getSharedLinkViewerToolbarActions(): Array<ContentActionRef> {
    return this.getAllowedActions(this.sharedLinkViewerToolbarActions);
  }
  loadContentMetadata(config: ExtensionConfig): any {
    const elements = this.loader.getElements<any>(
      config,
      "features.content-metadata-presets"
    );
    if (!elements.length) {
      return null;
    }

    let presets = {};
    presets = this.filterDisabled(mergeObjects(presets, ...elements));

    try {
      this.appConfig.config["content-metadata"] = { presets };
    } catch (error) {
      console.error(
        error,
        "- could not change content-metadata from app.config -"
      );
    }

    return { presets };
  }
  filterDisabled(object: Array<{ disabled: boolean }> | { disabled: boolean }) {
    if (Array.isArray(object)) {
      return object
        .filter(item => !item.disabled)
        .map(item => this.filterDisabled(item));
    } else if (typeof object === "object") {
      if (!object.disabled) {
        Object.keys(object).forEach(prop => {
          object[prop] = this.filterDisabled(object[prop]);
        });
        return object;
      }
    } else {
      return object;
    }
  }
  checkRule(ruleId: string): boolean {
    return this.extensions.evaluateRule(ruleId, this);
  }
}
