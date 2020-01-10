import { GroupMember, GroupMembershipBodyCreate } from "@alfresco/js-api";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { GroupsService } from "../../../pages/groups/groups.service";
import { GroupsDetailComponent } from "../groups-detail/groups-detail.component";

@Component({
  selector: "app-group-view-list",
  templateUrl: "./group-view-list.component.html",
  styleUrls: ["./group-view-list.component.scss"]
})
export class GroupViewListComponent implements OnInit {
  title: string;
  groupId = "";
  members: GroupMember[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _groupSv: GroupsService,
    public dialogRef: MatDialogRef<GroupsDetailComponent>
  ) {
    this.title = data.title;
    this.groupId = data.id;
    this.getMember();
  }
  getMember() {
    this._groupSv.getMembers(this.groupId).then(result => {
      this.members = result.list.entries.map(x => x.entry);
    });
  }
  deleteGroupMember(id) {
    if (id) {
      this._groupSv.deleteGroupMember(this.groupId, id).then(result => {
        this.getMember();
      });
    }
  }
  selectPerson(person) {
    if (person) {
      this._groupSv
        .addGroupMember(
          this.groupId,
          person.id,
          GroupMembershipBodyCreate.MemberTypeEnum.PERSON
        )
        .then(result => {
          this.getMember();
        });
    }
  }
  getIcon(membertype) {
    return membertype == GroupMembershipBodyCreate.MemberTypeEnum.PERSON
      ? "person"
      : "groups";
  }
  ngOnInit() {}
}
