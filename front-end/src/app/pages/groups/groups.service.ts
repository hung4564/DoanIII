import { Injectable } from '@angular/core';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ApiService, Webscript } from 'app/services/api.service';
export interface Group {
  id: string;
  displayName: string;
  parentIds?: string[];
}
@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  constructor(private apiService: ApiService) {}
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
  getGroups(pagination) {
    const webScript: Webscript = {
      httpMethod: 'GET',
      scriptPath: 'groups',
      scriptArgs: pagination,
      contextRoot: null,
      servicePath: 'api/-default-/public/alfresco/versions/1',
      postBody: null
    };
    return this.apiService.handleApi(webScript);
  }
  async createGroup(data: Group) {
    try {
      if (!data.id) {
        data.id = `GROUP_${data.displayName}`;
      }
      const webScript: Webscript = {
        httpMethod: 'POST',
        scriptPath: 'groups',
        scriptArgs: [],
        contextRoot: null,
        servicePath: 'api/-default-/public/alfresco/versions/1',
        postBody: data
      };
      const result = await this.apiService.handleApi(webScript);
      this.handleSuccess('CREATE');
      return result;
    } catch (error) {
      this.handleError(error, 'CREATE');
    }
  }
  async deleteGroup(id) {
    try {
      const webScript: Webscript = {
        httpMethod: 'DELETE',
        scriptPath: id,
        scriptArgs: [],
        contextRoot: null,
        servicePath: 'api/-default-/public/alfresco/versions/1/groups',
        postBody: null
      };
      const result = await this.apiService.handleApi(webScript);
      this.handleSuccess('DELETE');
      return result;
    } catch (error) {
      this.handleError(error, 'DELETE');
    }
  }
  async getGroup(id) {
    try {
      const webScript: Webscript = {
        httpMethod: 'GET',
        scriptPath: id,
        scriptArgs: [],
        contextRoot: null,
        servicePath: 'api/-default-/public/alfresco/versions/1/groups',
        postBody: null
      };
      const result = await this.apiService.handleApi(webScript);
      return result.entry;
    } catch (error) {
      this.handleError(error, 'GET');
    }
  }
  async updateGroup(id, data: Group) {
    try {
      const webScript: Webscript = {
        httpMethod: 'PUT',
        scriptPath: id,
        scriptArgs: [],
        contextRoot: null,
        servicePath: 'api/-default-/public/alfresco/versions/1/groups',
        postBody: data
      };
      const result = await this.apiService.handleApi(webScript);
      this.handleSuccess('EDIT');
      return result;
    } catch (error) {
      this.handleError(error, 'EDIT');
    }
  }
  handleSuccess(typeaction) {
    const key = `APP.MESSAGES.GROUPS.${typeaction}_SUCCESS`;
    this.apiService.showSuccess(key);
  }
  handleError(error, typeaction) {
    this.apiService.showError(error);
  }
}
