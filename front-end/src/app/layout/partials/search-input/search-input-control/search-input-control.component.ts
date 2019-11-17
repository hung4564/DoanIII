import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewEncapsulation,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-search-input-control',
  templateUrl: './search-input-control.component.html',
  styleUrls: ['./search-input-control.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-search-control' }
})
export class SearchInputControlComponent implements OnDestroy {
  onDestroy$: Subject<boolean> = new Subject<boolean>();

  /** Type of the input field to render, e.g. "search" or "text" (default). */
  @Input()
  inputType = 'text';

  /** Emitted when the search is submitted pressing ENTER button.
   * The search term is provided as value of the event.
   */
  @Output()
  submit: EventEmitter<any> = new EventEmitter();

  /** Emitted when the search term is changed. The search term is provided
   * in the 'value' property of the returned object.  If the term is less
   * than three characters in length then the term is truncated to an empty
   * string.
   */
  @Output()
  searchChange: EventEmitter<string> = new EventEmitter();

  @ViewChild('searchInput')
  searchInput: ElementRef;

  searchTerm = '';

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  searchSubmit(event: any) {
    this.submit.emit(event);
  }

  inputChange(event: any) {
    this.searchChange.emit(event);
  }

  clear() {
    this.searchTerm = '';
    this.searchChange.emit('');
  }

  isTermTooShort() {
    return !!(this.searchTerm && this.searchTerm.length < 2);
  }
}
