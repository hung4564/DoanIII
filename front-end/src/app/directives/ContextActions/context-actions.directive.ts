import { Directive, Input, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ContextMenuService } from './context-menu.service';
import { ContextMenuOverlayRef } from './context-menu-overlay';

@Directive({
  selector: '[appContextActions]'
})
export class ContextActionsDirective implements OnInit, OnDestroy {
  private execute$: Subject<any> = new Subject();
  private subscriptions: Subscription[] = [];
  private overlayRef: ContextMenuOverlayRef = null;
  @Input('appContextEnable') enabled = true;
  @HostListener('contextmenu', ['$event'])
  onContextMenuEvent(event: MouseEvent) {
    if (event) {
      event.preventDefault();

      if (this.enabled) {
        const target = this.getTarget(event);
        if (target) {
          this.execute(event, target);
        }
      }
    }
  }
  constructor(private contextMenuService: ContextMenuService) {}
  ngOnInit() {
    this.subscriptions.push(
      fromEvent(document.body, 'contextmenu').subscribe(() => {
        if (this.overlayRef) {
          this.overlayRef.close();
        }
      }),

      this.execute$.pipe(debounceTime(300)).subscribe((event: MouseEvent) => {
        this.render(event);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
    this.execute$ = null;
  }

  execute(event: MouseEvent, target: Element) {
    if (!this.isSelected(target)) {
      target.dispatchEvent(new MouseEvent('click'));
    }
    this.execute$.next(event);
  }

  private render(event: MouseEvent) {
    this.overlayRef = this.contextMenuService.open({
      source: event,
      hasBackdrop: false,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      panelClass: 'cdk-overlay-pane'
    });
  }

  private getTarget(event: MouseEvent): Element {
    return this.findAncestor(<Element>event.target, 'adf-datatable-cell');
  }

  private isSelected(target: Element): boolean {
    if (!target) {
      return false;
    }

    return this.findAncestor(target, 'adf-datatable-row').classList.contains('adf-is-selected');
  }

  private findAncestor(el: Element, className: string): Element {
    if (el.classList.contains(className)) {
      return el;
    }
    // tslint:disable-next-line:curly
    while ((el = el.parentElement) && !el.classList.contains(className));
    return el;
  }
}
