import { Injectable } from '@angular/core';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  PersonBodyCreate,
  Person,
  PersonPaging,
  PersonEntry,
  PersonBodyUpdate
} from '@alfresco/js-api';
import { HandleService } from 'app/services/api.service';
export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  get peopleApi() {
    return this.apiService.peopleApi;
  }
  constructor(private apiService: AlfrescoApiService, private handleSV: HandleService) {
    this.apiService.groupsApi.addGroupMember;
  }
  createForm(user: PersonBodyCreate) {
    return new FormGroup({
      id: new FormControl(user.id, [Validators.required]),
      email: new FormControl(user.email, [Validators.required, Validators.email]),
      firstName: new FormControl(user.firstName, [Validators.required]),
      lastName: new FormControl(user.lastName)
    });
  }
  async createUser(data: PersonBodyCreate) {
    try {
      if (!data.password) {
        data.password = '12345678';
      }
      await this.peopleApi.addPerson(data);
      this.handleSuccess('CREATE');
    } catch (error) {
      this.handleError(error, 'CREATE');
    }
  }
  getUser(id: string): Promise<Person> {
    return this.peopleApi.getPerson(id).then(result => result.entry);
  }
  updateUser(id: string, data: PersonBodyUpdate): Promise<Person> {
    delete data['id'];
    delete data['password'];
    return this.peopleApi.updatePerson(id, data).then(result => {
      this.handleSuccess('EDIT');
      return result.entry;
    });
  }
  async deleteUser(id: string) {
    try {
      await this.apiService
        .getInstance()
        .webScript.executeWebScript(
          'DELETE',
          id,
          { contentType: 'application/json' },
          null,
          'service/api/people',
          null
        );
      this.handleSuccess('DELETE');
    } catch (error) {
      this.handleError(error, 'DELETE');
    }
  }
  formatData(items: PersonEntry[]) {
    const results = [];
    for (const entry of items) {
      results.push({
        ...entry.entry,
        icon: 'material-icons://accessibility'
      });
    }
    return results;
  }
  getUsers(opts?) {
    return this.peopleApi.getPersons(opts);
  }

  handleSuccess(typeaction) {
    const key = `APP.MESSAGES.USERS.${typeaction}_SUCCESS`;
    this.handleSV.showSuccess(key);
  }
  handleError(error, typeaction) {
    this.handleSV.showError(error);
  }
}
