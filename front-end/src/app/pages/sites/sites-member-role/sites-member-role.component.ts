import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Site, Person } from '@alfresco/js-api';

@Component({
  selector: 'app-sites-member-role',
  templateUrl: './sites-member-role.component.html',
  styleUrls: ['./sites-member-role.component.scss']
})
export class SitesMemberRoleComponent implements OnInit {
  siteForm: FormGroup;
  title: string;
  roles = Site.RoleEnum;
  person: Person;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SitesMemberRoleComponent>
  ) {
    this.title = data.title;
    this.person = data.data.person;
    this.siteForm = new FormGroup({
      id: new FormControl(data.data.id),
      role: new FormControl(data.data.role, [Validators.required])
    });
  }
  ngOnInit() {}
  revert() {
    this.siteForm.reset();
  }
  hasError(controlName: string, errorName: string) {
    return this.siteForm.controls[controlName].hasError(errorName);
  }
  onSubmit() {
    this.dialogRef.close(this.siteForm.value);
  }
}
