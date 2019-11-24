import { Injectable } from "@angular/core";
import { AlfrescoApiService, UserPreferencesService } from "@alfresco/adf-core";
import { Observable, from } from "rxjs";
import {
  MinimalNodeEntity,
  NodePaging,
  Node,
  DeletedNodesPaging,
  PersonEntry,
  NodeEntry,
  DiscoveryEntry,
  FavoritePaging,
  SharedLinkPaging,
  SearchRequest,
  ResultSetPaging,
  SiteBody,
  SiteEntry,
  FavoriteBody,
  FavoriteEntry,
  PersonBodyCreate,
  PersonBodyUpdate,
  GroupBodyCreate,
  GroupBodyUpdate,
  SiteMembershipBodyUpdate,
  SiteMembershipBodyCreate,
  SitesApi
} from "@alfresco/js-api";
import { map } from "rxjs/operators";
import { TaskPaging, TaskEntry, ProcessDefinitionPaging } from "app/model";

@Injectable({
  providedIn: "root"
})
export class ContentApiService {
  constructor(
    private api: AlfrescoApiService,
    private preferences: UserPreferencesService
  ) {}

  /**
   * Moves a node to the trashcan.
   * @param nodeId ID of the target node
   * @param options Optional parameters supported by JS-API
   * @returns Empty result that notifies when the deletion is complete
   */
  deleteNode(
    nodeId: string,
    options: { permanent?: boolean } = {}
  ): Observable<void> {
    return from(this.api.nodesApi.deleteNode(nodeId, options));
  }

  /**
   * Gets the stored information about a node.
   * @param nodeId ID of the target node
   * @param options Optional parameters supported by JS-API
   * @returns Node information
   */
  getNode(nodeId: string, options: any = {}): Observable<MinimalNodeEntity> {
    const defaults = {
      include: ["path", "properties", "allowableOperations", "permissions"]
    };
    const queryOptions = Object.assign(defaults, options);

    return from(this.api.nodesApi.getNode(nodeId, queryOptions));
  }

  getNodeInfo(nodeId: string, options?: any): Observable<Node> {
    const defaults = {
      include: ["isFavorite", "allowableOperations"]
    };
    const queryOptions = Object.assign(defaults, options || {});

    return from(this.api.nodesApi.getNodeInfo(nodeId, queryOptions));
  }

  /**
   * Gets the items contained in a folder node.
   * @param nodeId ID of the target node
   * @param options Optional parameters supported by JS-API
   * @returns List of child items from the folder
   */
  getNodeChildren(nodeId: string, options: any = {}): Observable<NodePaging> {
    const defaults = {
      maxItems: this.preferences.paginationSize,
      skipCount: 0,
      include: [
        "isLocked",
        "path",
        "properties",
        "allowableOperations",
        "permissions"
      ]
    };
    const queryOptions = Object.assign(defaults, options);

    return from(this.api.nodesApi.getNodeChildren(nodeId, queryOptions));
  }

  deleteSharedLink(linkId: string): Observable<any> {
    return from(this.api.sharedLinksApi.deleteSharedLink(linkId));
  }

  getDeletedNodes(options: any = {}): Observable<DeletedNodesPaging> {
    const defaults = {
      include: ["path"]
    };
    const queryOptions = Object.assign(defaults, options);

    return from(this.api.nodesApi.getDeletedNodes(queryOptions));
  }

  restoreNode(nodeId: string): Observable<MinimalNodeEntity> {
    return from(this.api.nodesApi.restoreNode(nodeId));
  }

  purgeDeletedNode(nodeId: string): Observable<any> {
    return from(this.api.nodesApi.purgeDeletedNode(nodeId));
  }

  /**
   * Gets information about a user identified by their username.
   * @param personId ID of the target user
   * @returns User information
   */
  getPerson(
    personId: string,
    options?: { fields?: Array<string> }
  ): Observable<PersonEntry> {
    return from(this.api.peopleApi.getPerson(personId, options));
  }

  /**
   * Copy a node to destination node
   *
   * @param nodeId The id of the node to be copied
   * @param targetParentId The id of the folder-node where the node have to be copied to
   * @param name The new name for the copy that would be added on the destination folder
   */
  copyNode(
    nodeId: string,
    targetParentId: string,
    name?: string,
    opts?: { include?: Array<string>; fields?: Array<string> }
  ): Observable<NodeEntry> {
    return from(
      this.api.nodesApi.copyNode(nodeId, { targetParentId, name }, opts)
    );
  }

  /**
   * Gets product information for Content Services.
   * @returns ProductVersionModel containing product details
   */
  getRepositoryInformation(): Observable<DiscoveryEntry> {
    return from(
      this.api.getInstance().discovery.discoveryApi.getRepositoryInformation()
    );
  }

  getFavorites(
    personId: string,
    opts?: {
      skipCount?: number;
      maxItems?: number;
      where?: string;
      fields?: Array<string>;
    }
  ): Observable<FavoritePaging> {
    return from(this.api.favoritesApi.getFavorites(personId, opts));
  }

  getFavoriteLibraries(
    personId: string = "-me-",
    opts?: any
  ): Observable<FavoritePaging> {
    return this.getFavorites(personId, {
      ...opts,
      where: "(EXISTS(target/site))"
    }).pipe(
      map((response: FavoritePaging) => {
        return {
          list: {
            entries: response.list.entries.map(({ entry }: any) => {
              entry.target.site.createdAt = entry.createdAt;
              return {
                entry: entry.target.site
              };
            }),
            pagination: response.list.pagination
          }
        };
      })
    );
  }

  findSharedLinks(opts?: any): Observable<SharedLinkPaging> {
    return from(this.api.sharedLinksApi.findSharedLinks(opts));
  }

  getSharedLinkContent(sharedId: string, attachment?: boolean): string {
    return this.api.contentApi.getSharedLinkContentUrl(sharedId, attachment);
  }

  search(request: SearchRequest): Observable<ResultSetPaging> {
    return from(this.api.searchApi.search(request));
  }

  getContentUrl(nodeId: string, attachment?: boolean): string {
    return this.api.contentApi.getContentUrl(nodeId, attachment);
  }

  deleteSite(siteId?: string, opts?: { permanent?: boolean }): Observable<any> {
    return from(this.api.sitesApi.deleteSite(siteId, opts));
  }

  leaveSite(siteId?: string): Observable<any> {
    return from(this.api.sitesApi.removeSiteMember(siteId, "-me-"));
  }

  createSite(
    siteBody: SiteBody,
    opts?: {
      fields?: Array<string>;
      skipConfiguration?: boolean;
      skipAddToFavorites?: boolean;
    }
  ): Observable<SiteEntry> {
    return from(this.api.sitesApi.createSite(siteBody, opts));
  }

  getSite(
    siteId?: string,
    opts?: { relations?: Array<string>; fields?: Array<string> }
  ): Observable<SiteEntry> {
    return from(this.api.sitesApi.getSite(siteId, opts));
  }
  getSiteMember(siteId: string, opts?: any) {
    return from(this.api.sitesApi.getSiteMembers(siteId, opts));
  }
  getSiteMemberRequest(siteId: string, opts?: any) {
    const siteApi = new SitesApi(this.api.getInstance());
    return from(
      siteApi.getSiteMembershipRequests({
        ...opts,
        where: `(siteId=${siteId})`
      })
    );
  }

  updateLibrary(siteId: string, siteBody: SiteBody): Observable<SiteEntry> {
    return from(this.api.sitesApi.updateSite(siteId, siteBody));
  }
  addMemberLibrary(siteId: string, body: SiteMembershipBodyCreate) {
    return from(this.api.sitesApi.addSiteMember(siteId, body));
  }
  updateMemberLibrary(
    siteId: string,
    personId: string,
    body: SiteMembershipBodyUpdate
  ) {
    return from(this.api.sitesApi.updateSiteMember(siteId, personId, body));
  }
  deleteMemberLibrary(siteId: string, personId: string) {
    return from(this.api.sitesApi.removeSiteMember(siteId, personId));
  }
  approveMemberLibrary(siteId: string, inviteeId: string, opts?: any) {
    const siteApi = new SitesApi(this.api.getInstance());
    return from(siteApi.approveSiteMembershipRequest(siteId, inviteeId, opts));
  }
  rejectMemberLibrary(siteId: string, inviteeId: string, opts?: any) {
    const siteApi = new SitesApi(this.api.getInstance());
    return from(siteApi.rejectSiteMembershipRequest(siteId, inviteeId, opts));
  }
  addFavorite(nodes: Array<MinimalNodeEntity>): Observable<FavoriteEntry> {
    const payload: FavoriteBody[] = nodes.map(node => {
      const { isFolder, nodeId, id } = <any>node.entry;
      const siteId = node.entry["guid"];
      const type = siteId ? "site" : isFolder ? "folder" : "file";
      const guid = siteId || nodeId || id;

      return {
        target: {
          [type]: {
            guid
          }
        }
      };
    });

    return from(this.api.favoritesApi.addFavorite("-me-", <any>payload));
  }

  removeFavorite(nodes: Array<MinimalNodeEntity>): Observable<any> {
    return from(
      Promise.all(
        nodes.map((node: any) => {
          const id = node.entry.nodeId || node.entry.id;
          return this.api.favoritesApi.removeFavoriteSite("-me-", id);
        })
      )
    );
  }

  unlockNode(nodeId: string, opts?: any) {
    return this.api.nodesApi.unlockNode(nodeId, opts);
  }

  getPeople(opt) {
    return from(this.api.peopleApi.getPersons(opt));
  }
  createPerson(person: PersonBodyCreate) {
    if (!person.password) {
      person.password = "12345678";
    }
    return from(this.api.peopleApi.addPerson(clean(person)));
  }
  editPerson(id: string, person: PersonBodyUpdate) {
    delete person["id"];
    return from(this.api.peopleApi.updatePerson(id, clean(person)));
  }
  deletePerson(id: string) {
    return from(
      this.api
        .getInstance()
        .webScript.executeWebScript(
          "DELETE",
          id,
          { contentType: "application/json" },
          null,
          "service/api/people",
          null
        )
    );
  }
  getGroups(opt) {
    return from(this.api.groupsApi.getGroups(opt));
  }
  createGroup(group: GroupBodyCreate) {
    if (!group.id) {
      group.id = group.displayName;
    }
    return from(this.api.groupsApi.createGroup(group));
  }
  editGroup(id: string, group: GroupBodyUpdate) {
    delete group["id"];
    return from(this.api.groupsApi.updateGroup(id, group));
  }
  deleteGroup(id: string) {
    return from(this.api.groupsApi.deleteGroup(id));
  }
  getProcessDefinitions(opts?): Observable<ProcessDefinitionPaging> {
    return from(
      this.api
        .getInstance()
        .webScript.executeWebScript(
          "GET",
          "process-definitions",
          { contentType: "application/json", ...opts },
          null,
          "api/-default-/public/workflow/versions/1",
          null
        )
    );
  }
  getProcessDefinitionForm(id: string) {
    this.api
      .getInstance()
      .webScript.executeWebScript(
        "GET",
        id + "/image",
        null,
        null,
        "api/-default-/public/workflow/versions/1/process-definitions",
        null
      );
    return from(
      this.api
        .getInstance()
        .webScript.executeWebScript(
          "GET",
          id + "/start-form-model",
          { contentType: "application/json" },
          null,
          "api/-default-/public/workflow/versions/1/process-definitions",
          null
        )
    ).pipe(map(this.toJson));
  }
  toJson(res: any) {
    if (res) {
      return res || {};
    }
    return {};
  }
  getTasks(opts): Observable<TaskPaging> {
    return from(
      this.api
        .getInstance()
        .webScript.executeWebScript(
          "GET",
          "tasks",
          { contentType: "application/json", ...opts },
          null,
          "api/-default-/public/workflow/versions/1",
          null
        )
    );
  }
  getTask(id: string): Observable<TaskEntry> {
    return from(
      this.api
        .getInstance()
        .webScript.executeWebScript(
          "GET",
          id,
          { contentType: "application/json" },
          null,
          "api/-default-/public/workflow/versions/1/tasks",
          null
        )
    );
  }
  createApproveFolder(siteguid: string) {
    const body = {
      name: "needApproveDocumentLibrary",
      nodeType: "cm:folder",
      aspectNames: ["cm:tagscope", "st:siteContainer", "cm:auditable"],
      properties: {
        "st:componentId": "needApproveDocumentLibrary"
      }
    };
    return from(this.api.nodesApi.addNode(siteguid, body));
  }
  moveFile(nodeId: string, targetParentId: string, name?: string) {
    return from(this.api.nodesApi.moveNode(nodeId, { targetParentId, name }));
  }
}
function clean(obj) {
  var propNames = Object.getOwnPropertyNames(obj);
  for (var i = 0; i < propNames.length; i++) {
    var propName = propNames[i];
    if (
      obj[propName] === null ||
      obj[propName] === undefined ||
      obj[propName] === ""
    ) {
      delete obj[propName];
    }
  }
  return obj;
}
