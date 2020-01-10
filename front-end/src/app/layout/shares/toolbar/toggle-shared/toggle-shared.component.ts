import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { SelectionState } from '@alfresco/adf-extensions';
import { getAppSelection } from 'app/store/selectors/app.selector';
import { ShareNodeAction } from 'app/store/actions/node.actions';

@Component({
  selector: 'app-toggle-shared',
  templateUrl: './toggle-shared.component.html'
})
export class ToggleSharedComponent implements OnInit {
  selection$: Observable<SelectionState>;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.selection$ = this.store.select(getAppSelection);
  }

  isShared(selection: SelectionState) {
    // workaround for shared files
    if (selection.first && selection.first.entry && (<any>selection.first.entry).sharedByUser) {
      return true;
    }

    return (
      selection.first &&
      selection.first.entry &&
      selection.first.entry.properties &&
      !!selection.first.entry.properties['qshare:sharedId']
    );
  }

  editSharedNode(selection: SelectionState) {
    this.store.dispatch(new ShareNodeAction(selection.first));
  }
}
