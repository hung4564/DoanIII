import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GroupsService } from '../groups.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-groups-detail',
  templateUrl: './groups-detail.component.html',
  styleUrls: ['./groups-detail.component.scss']
})
export class GroupsDetailComponent implements OnInit {
  groupForm: FormGroup;
  title: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _groupSv: GroupsService,
    public dialogRef: MatDialogRef<GroupsDetailComponent>
  ) {
    this.title = data.title;
    this.groupForm = this._groupSv.createForm(data);
  }

  ngOnInit() {}
  revert() {
    this.groupForm.reset();
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.groupForm.controls[controlName].hasError(errorName);
  }
  onSubmit(groupData) {
    this.dialogRef.close(groupData);
  }
}
