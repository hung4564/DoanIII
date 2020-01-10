import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { PersonBodyCreate } from "@alfresco/js-api";

@Component({
  selector: "app-person-detail",
  templateUrl: "./person-detail.component.html",
  styleUrls: ["./person-detail.component.scss"]
})
export class PersonDetailComponent implements OnInit {
  userForm: FormGroup;
  title: string;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { person: PersonBodyCreate; title: string; type: string },
    public dialogRef: MatDialogRef<PersonDetailComponent>
  ) {
    this.userForm = this.createForm(data.person);
  }
  createForm(user: PersonBodyCreate) {
    return new FormGroup({
      id: new FormControl(user.id, [Validators.required]),
      email: new FormControl(user.email, [
        Validators.required,
        Validators.email
      ]),
      firstName: new FormControl(user.firstName, [Validators.required]),
      lastName: new FormControl(user.lastName)
    });
  }
  revert() {
    this.userForm.reset();
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.userForm.controls[controlName].hasError(errorName);
  };
  onSubmit(userData) {
    this.dialogRef.close(userData);
  }
  ngOnInit() {}
}
