import { ProfileState } from "@alfresco/adf-extensions";
import { Person } from "@alfresco/js-api";
import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { Store } from "@ngrx/store";
import { AppService } from "app/services/app.service";
import { ContentApiService } from "app/services/content-api.service";
import { SetUserProfileAction } from "app/store/actions/app.actions";
import { getUserProfile } from "app/store/selectors/app.selector";
import { Observable } from "rxjs";

@Component({
  selector: "app-current-profile",
  templateUrl: "./current-profile.component.html",
  styleUrls: ["./current-profile.component.scss"]
})
export class CurrentProfileComponent implements OnInit {
  userForm: FormGroup;
  passwordForm: FormGroup;
  profile$: Observable<ProfileState>;
  isLoading = false;
  selectedIndex = 0;
  profile: ProfileState;
  constructor(
    private store: Store<any>,
    private appService: AppService,
    private fb: FormBuilder,
    public contentApi: ContentApiService
  ) {}

  ngOnInit() {
    this.profile$ = this.store.select(getUserProfile);
    this.profile$.subscribe(profile => (this.profile = profile));
    this.passwordForm = this.createPasswordForm();
    this.isLoading = true;
    this.contentApi.getPerson("-me-").subscribe(person => {
      this.isLoading = false;
      this.userForm = this.createForm(person.entry);
    });
  }
  createPasswordForm() {
    return this.fb.group(
      {
        password: new FormControl("", [
          Validators.required,
          Validators.minLength(8)
        ]),
        confirmPassword: new FormControl("", [Validators.required]),
        oldPassword: new FormControl("", [Validators.required])
      },
      {
        validator: CustomValidators.passwordMatchValidator
      }
    );
  }
  createForm(user: Person) {
    return this.fb.group({
      id: new FormControl({ value: user.id, disabled: true }, [
        Validators.required
      ]),
      email: new FormControl(user.email, [
        Validators.required,
        Validators.email
      ]),
      firstName: new FormControl(user.firstName, [Validators.required]),
      lastName: new FormControl(user.lastName)
    });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.userForm.controls[controlName].hasError(errorName);
  };
  public hasPassError = (controlName: string, errorName: string) => {
    return this.passwordForm.controls[controlName].hasError(errorName);
  };
  submit() {
    let currentForm: FormGroup;
    if (this.selectedIndex == 0) {
      currentForm = this.userForm;
    } else if (this.selectedIndex == 1) {
      currentForm = this.passwordForm;
    }
    if (currentForm) {
      if (currentForm.valid) {
        const data = Object.assign({}, currentForm.value);
        delete data["confirmPassword"];
        delete data["id"];
        this.contentApi.editPerson(this.profile.id, data).subscribe(
          person => {
            this.store.dispatch(
              new SetUserProfileAction({
                person: person.entry,
                groups: this.profile.groups
              })
            );
          },
          err => {}
        );
      } else {
        Object.keys(currentForm.controls).forEach(field => {
          const control = this.userForm.get(field);
          control.markAsTouched({ onlySelf: true });
        });
      }
    }
  }
}
export class CustomValidators {
  static passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get("password").value;
    const confirmPassword: string = control.get("confirmPassword").value;
    if (password !== confirmPassword) {
      control.get("confirmPassword").setErrors({ NoPassswordMatch: true });
    }
  }
}
