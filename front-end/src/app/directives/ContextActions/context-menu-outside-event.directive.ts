import {
  Directive,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { filter } from "rxjs/operators";

@Directive({
  selector: "[appContextMenuOutsideEvent]"
})
export class OutsideEventDirective implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  @Output()
  clickOutside: EventEmitter<null> = new EventEmitter();

  constructor() {}

  ngOnInit() {
    this.subscriptions = this.subscriptions.concat([
      fromEvent(document.body, "click")
        .pipe(filter(event => !this.findAncestor(event.target as Element)))
        .subscribe(() => this.clickOutside.next())
    ]);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }

  private findAncestor(el: Element): boolean {
    const className = "app-context-menu";

    if (el.classList.contains(className)) {
      return true;
    }
    while ((el = el.parentElement) && !el.classList.contains(className));
    return !!el;
  }
}
