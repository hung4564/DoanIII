import { Component, OnInit, Input, OnDestroy} from '@angular/core';
import { NavBarGroupRef } from '@alfresco/adf-extensions';
import { Store } from '@ngrx/store';
import { AppStore, getSideNavState } from 'app/store';
import { AppExtensionService } from 'app/extensions/app-extension.service';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
  groups: Array<NavBarGroupRef> = [];
  private onDestroy$: Subject<boolean> = new Subject<boolean>();
  @Input() mode: 'collapsed' | 'expanded' = 'expanded';
  constructor(private store: Store<AppStore>, private extensions: AppExtensionService) {}

  ngOnInit() {
    this.store
      .select(getSideNavState)
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.onDestroy$)
      )
      .subscribe(() => {
        this.groups = this.extensions.getApplicationNavigation(this.extensions.navbar);
        console.log('TCL: SidenavComponent -> ngOnInit -> this.groups', this.groups);
      });
  }

  trackById(_: number, obj: { id: string }) {
    return obj.id;
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
