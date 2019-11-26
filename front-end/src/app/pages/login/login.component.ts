import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileState } from '@alfresco/adf-extensions';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { LoginErrorEvent } from '@alfresco/adf-core';
import { SnackbarErrorAction } from 'app/store/actions/snackbar.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  host: {
    class: 'full-height'
  }
})
export class LoginComponent implements OnInit {
  profile$: Observable<ProfileState>;
  constructor(private router: Router, private store: Store<any>) {}
  mySuccessMethod() {
    this.router.navigate(['/']);
  }
  errorHandle(error: LoginErrorEvent) {
    let message = 'APP.MESSAGES.ERRORS.GENERIC';

    if (error.err.status === 400) {
      message = 'APP.MESSAGES.ERRORS.LOGIN.400';
    }

    if (error.err.status === 401) {
      message = 'APP.MESSAGES.ERRORS.LOGIN.401';
    }

    if (error.err.status === 500) {
      message = 'APP.MESSAGES.ERRORS.LOGIN.500';
    }

    if (error.err.status === 504) {
      message = 'APP.MESSAGES.ERRORS.LOGIN.504';
    }

    this.store.dispatch(new SnackbarErrorAction(message));
  }
  ngOnInit() {}
}
