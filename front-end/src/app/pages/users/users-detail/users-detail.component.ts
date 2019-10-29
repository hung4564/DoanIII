import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UsersService } from '../users.service';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-users-detail',
  templateUrl: './users-detail.component.html',
  styleUrls: ['./users-detail.component.scss']
})
export class UsersDetailComponent implements OnInit {
  userForm: FormGroup;
  title: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _userSv: UsersService,
    public dialogRef: MatDialogRef<UsersDetailComponent>
  ) {
    this.title = data.title;
    this.userForm = this._userSv.createForm(data);
  }
  ngOnInit() {}
  revert() {
    this.userForm.reset();
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.userForm.controls[controlName].hasError(errorName);
  }
  onSubmit(userData) {
    this.dialogRef.close(userData);
  }
}
