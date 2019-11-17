import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-groups-detail',
  templateUrl: './groups-detail.component.html',
  styleUrls: ['./groups-detail.component.scss']
})
export class GroupsDetailComponent implements OnInit {
  groupForm: FormGroup;
  title: string;
  type: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<GroupsDetailComponent>
  ) {
    this.title = data.title;
    this.type = data.type;
    this.groupForm = this.createForm(data.group);
  }
  createForm(data) {
    return new FormGroup({
      id: new FormControl({ value: data.id, disabled: this.type != 'CREATE' }, [
        Validators.required
      ]),
      displayName: new FormControl(data.displayName, [Validators.required])
    });
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
