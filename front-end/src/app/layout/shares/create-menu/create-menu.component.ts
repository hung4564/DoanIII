import { Component, Input, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { AppExtensionService } from 'app/extensions/app-extension.service';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppStore } from 'app/store/states/app.state';
import { getCurrentFolder } from 'app/store/selectors/app.selector';

@Component({
  selector: 'app-create-menu',
  templateUrl: 'create-menu.component.html',
  styleUrls: ['./create-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-create-menu' }
})
export class CreateMenuComponent implements OnInit, OnDestroy {
  createActions: Array<ContentActionRef> = [];
  onDestroy$: Subject<boolean> = new Subject<boolean>();

  @Input()
  showLabel: boolean;

  @Input()
  expanded: boolean;

  constructor(private store: Store<any>, private extensions: AppExtensionService) {}

  ngOnInit() {
    this.store
      .select(getCurrentFolder)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.createActions = this.extensions.getCreateActions();
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  trackById(_: number, obj: { id: string }) {
    return obj.id;
  }
}
