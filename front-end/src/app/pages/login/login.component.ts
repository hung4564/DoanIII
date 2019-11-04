import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileState } from '@alfresco/adf-extensions';
import { Store } from '@ngrx/store';
import { AppStore } from 'app/store/states/app.state';
import { getUserProfile } from 'app/store/selectors/app.selector';
import { Router } from '@angular/router';
import { PageComponent } from '../page.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  host: {
    class: 'full-height'
  }
})
export class LoginComponent extends PageComponent implements OnInit {
  profile$: Observable<ProfileState>;
  constructor(private router: Router, private store: Store<AppStore>) {
    super();
  }
  mySuccessMethod($event) {
    this.store.select(getUserProfile).subscribe(result => {
      if (result.isAdmin) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);
      }
    });
  }
  ngOnInit() {}
}
