import { OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

export abstract class PageComponent implements OnInit, OnDestroy {
  title = 'Page';
  onDestroy$: Subject<boolean> = new Subject<boolean>();
  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
