import { Injectable } from '@angular/core';
import { AlfrescoApiService, IdentityUserService } from '@alfresco/adf-core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { HandleService, Webscript } from 'app/services/api.service';
import {
  GroupBodyCreate,
  GroupBodyUpdate,
  GroupMemberPaging,
  GroupPaging,
  GroupMembershipBodyCreate
} from '@alfresco/js-api';
export interface Group {
  id: string;
  displayName: string;
  parentIds?: string[];
}
@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  get groupApi() {
    return this.alfApiService.groupsApi;
  }
  constructor(private alfApiService: AlfrescoApiService, private handleService: HandleService) {}
  createForm(data: Group): FormGroup {
    return new FormGroup({
      displayName: new FormControl(data.displayName, [Validators.required])
    });
  }
  formatData(items) {
    const results = [];
    for (const entry of items) {
      results.push({ ...entry.entry, icon: 'material-icons://groups' });
    }
    return results;
  }
  getGroups(pagination): Promise<GroupPaging> {
    return this.groupApi.getGroups(pagination);
  }
  async createGroup(data: GroupBodyCreate) {
    try {
      if (!data.id) {
        data.id = `GROUP_${data.displayName}`;
      }
      const result = this.groupApi.createGroup(data);
      this.handleSuccess('CREATE');
      return result;
    } catch (error) {
      this.handleError(error, 'CREATE');
    }
  }
  async deleteGroup(id) {
    try {
      const result = await this.groupApi.deleteGroup(id);
      this.handleSuccess('DELETE');
      return result;
    } catch (error) {
      this.handleError(error, 'DELETE');
    }
  }
  async getGroup(id) {
    try {
      const result = await this.groupApi.getGroup(id);
      return result.entry;
    } catch (error) {
      this.handleError(error, 'GET');
    }
  }
  async updateGroup(id: string, data: GroupBodyUpdate) {
    try {
      const result = await this.groupApi.updateGroup(id, data);
      this.handleSuccess('EDIT');
      return result;
    } catch (error) {
      this.handleError(error, 'EDIT');
    }
  }
  async getMembers(id_group: string): Promise<GroupMemberPaging> {
    try {
      const result = await this.groupApi.getGroupMembers(id_group);
      return result;
    } catch (error) {
      this.handleError(error, 'GET');
    }
  }
  async addGroupMember(
    groupId: string,
    personId: string,
    memberType: GroupMembershipBodyCreate.MemberTypeEnum
  ) {
    try {
      const data: GroupMembershipBodyCreate = { id: personId, memberType: memberType };
      const result = await this.groupApi.addGroupMember(groupId, data);
      this.handleSuccess('ADD_GROUP_MEMBER');
      return result;
    } catch (error) {
      this.handleError(error, 'ADD_GROUP_MEMBER');
    }
  }
  async deleteGroupMember(groupId: string, personId: string) {
    try {
      const result = await this.groupApi.deleteGroupMember(groupId, personId);
      this.handleSuccess('EDIT_GROUP_MEMBER');
      return result;
    } catch (error) {
      this.handleError(error, 'EDIT_GROUP_MEMBER');
    }
  }
  handleSuccess(typeaction) {
    const key = `APP.MESSAGES.GROUPS.${typeaction}_SUCCESS`;
    this.handleService.showSuccess(key);
  }
  handleError(error, typeaction) {
    this.handleService.showError(error);
  }
}
