import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GroupsService } from '../groups.service';
import { GroupsDetailComponent } from '../groups-detail/groups-detail.component';
import { GroupMember } from '@alfresco/js-api';

@Component({
  selector: 'app-group-view-list',
  templateUrl: './group-view-list.component.html',
  styleUrls: ['./group-view-list.component.scss']
})
export class GroupViewListComponent implements OnInit {
  title: string;
  members: GroupMember[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _groupSv: GroupsService,
    public dialogRef: MatDialogRef<GroupsDetailComponent>
  ) {
    this.title = data.title;
    this._groupSv.getMembers(data.id).then(result => {
      this.members = result.list.entries.map(x => x.entry);
      console.log('TCL: GroupViewListComponent -> this.members', this.members);
    });
  }

  ngOnInit() {}
}
