 import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  HostListener,
  ViewChild,
  AfterViewInit,
  Inject
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { CONTEXT_MENU_DIRECTION } from '../direction.token';
import { Directionality } from '@angular/cdk/bidi';
import { ContextMenuOverlayRef } from '../context-menu-overlay';
import { AppExtensionService } from 'app/extensions/app-extension.service';
import { AppStore } from 'app/store/states/app.state';
import { getAppSelection } from 'app/store/selectors/app.selector';

@Component({
  selector: 'aca-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.theme.scss'],
  host: {
    class: 'aca-context-menu-holder'
  },
  encapsulation: ViewEncapsulation.None
})
export class ContextMenuComponent implements OnInit, OnDestroy, AfterViewInit {
  private onDestroy$: Subject<boolean> = new Subject<boolean>();
  actions: Array<ContentActionRef> = [];

  @ViewChild(MatMenuTrigger)
  trigger: MatMenuTrigger;

  @HostListener('document:keydown.Escape', ['$event'])
  handleKeydownEscape(event: KeyboardEvent) {
    if (event) {
      if (this.contextMenuOverlayRef) {
        this.contextMenuOverlayRef.close();
      }
    }
  }

  constructor(
    private contextMenuOverlayRef: ContextMenuOverlayRef,
    private extensions: AppExtensionService,
    private store: Store<any>,
    @Inject(CONTEXT_MENU_DIRECTION) public direction: Directionality
  ) {}

  onClickOutsideEvent() {
    if (this.contextMenuOverlayRef) {
      this.contextMenuOverlayRef.close();
    }
  }

  runAction(actionId: string) {
    this.extensions.runActionById(actionId);
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  ngOnInit() {
    this.store
      .select(getAppSelection)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(selection => {
        if (selection.count) {
          this.actions = this.extensions.getAllowedContextMenuActions();
        }
      });
  }

  ngAfterViewInit() {
    setTimeout(() => this.trigger.openMenu(), 0);
  }

  trackById(_: number, obj: { id: string }) {
    return obj.id;
  }
}
