import { Injectable } from '@angular/core';
import { AlfrescoApiService, IdentityUserService } from '@alfresco/adf-core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
export interface User {
  id?: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private apiService: AlfrescoApiService) {}
  createForm(
    user: User = { email: '', userName: '', firstName: '', lastName: '', password: '12345678' }
  ) {
    return new FormGroup({
      email: new FormControl(user.email, [Validators.required, Validators.email]),
      userName: new FormControl(user.userName, [Validators.required]),
      firstName: new FormControl(user.firstName, [Validators.required]),
      lastName: new FormControl(user.lastName),
      password: new FormControl(user.password || '12345678')
    });
  }
  createUser(data: User) {
    return this.apiService
      .getInstance()
      .webScript.executeWebScript(
        'POST',
        'people',
        { contentType: 'application/json' },
        null,
        'service/api',
        data
      );
  }
  getUser(id: string) {
    return this.apiService
      .getInstance()
      .webScript.executeWebScript(
        'GET',
        id,
        { contentType: 'application/json' },
        null,
        'service/api/people',
        null
      );
  }
  updateUser(id, data: User) {
    return this.apiService
      .getInstance()
      .webScript.executeWebScript(
        'PUT',
        id,
        { contentType: 'application/json' },
        null,
        'service/api/people',
        data
      );
  }
  deleteUser(id) {
    return this.apiService
      .getInstance()
      .webScript.executeWebScript(
        'DELETE',
        id,
        { contentType: 'application/json' },
        null,
        'service/api/people',
        null
      );
  }
  getUsers() {
    return this.apiService
      .getInstance()
      .webScript.executeWebScript(
        'GET',
        'people',
        [],
        null,
        'api/-default-/public/alfresco/versions/1',
        null
      )
      .then((response: any) => {
        const results = [];
        for (const entry of response.list.entries) {
          results.push({
            id: entry.entry.id,
            email: entry.entry.email,
            firstName: entry.entry.firstName,
            lastName: entry.entry.lastName,
            status: 'green',
            icon: 'material-icons://accessibility'
          });
        }
        return results;
      });
  }
}
