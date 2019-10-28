import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { AppStore } from './store/states/app.state';
import { Store } from '@ngrx/store';
import { AuthenticationService, TranslationService, PageTitleService } from '@alfresco/adf-core';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  pageHeading = '';

  constructor(
    private _translateSv: TranslationService,
    private pageTitle: PageTitleService,
    private authService: AuthenticationService,
    private store: Store<AppStore>,
    private router: Router
  ) {
    this._translateSv.use('en');
  }
  ngOnInit() {
    const { router, pageTitle } = this;

    this.router.events
      .pipe(filter(event => event instanceof ActivationEnd && event.snapshot.children.length === 0))
      .subscribe((event: ActivationEnd) => {
        const snapshot: any = event.snapshot || {};
        const data: any = snapshot.data || {};

        this.pageHeading = data.title || '';
        pageTitle.setTitle(data.title || '');
      });
  }
}
