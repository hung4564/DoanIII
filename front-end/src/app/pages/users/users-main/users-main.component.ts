import { Component, OnInit } from '@angular/core';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { ObjectDataTableAdapter, ObjectDataRow } from '@alfresco/adf-core';
@Component({
  selector: 'app-users-main',
  templateUrl: './users-main.component.html',
  styleUrls: ['./users-main.component.scss']
})
export class UsersMainComponent implements OnInit {
  data = new ObjectDataTableAdapter([], []);
  constructor(private apiService: AlfrescoApiService) {
    this.apiService
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
        console.log('TCL: UsersMainComponent -> constructor -> response', response);
        const results = [];
        console.log("TCL: UsersMainComponent -> constructor -> results", results)
        for (const entry of response.list.entries) {
          results.push({
            id: entry.entry.id,
            firstName: entry.entry.firstName,
            lastName: entry.entry.lastName,
            status: 'green',
            icon: 'material-icons://accessibility'
          });
        }
        this.data.setRows(
          results.map(item => {
            return new ObjectDataRow(item);
          })
        );
      });
  }

  ngOnInit() {}
}
