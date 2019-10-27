import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AppStore } from './store/states/app.state';
import { Store } from '@ngrx/store';
import { AuthenticationService,TranslationService } from '@alfresco/adf-core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(
    private _translateSv: TranslationService,
    private authService: AuthenticationService,
    private store: Store<AppStore>,
    private router: Router
  ) {
    this._translateSv.use('en');
  }
}
