import { NameColumnComponent } from '@alfresco/adf-content-services';
import { AlfrescoApiService } from '@alfresco/adf-core';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { isLocked } from 'app/utils/node.utils';
import { NodeActionTypes } from 'app/store/actions/node.action';

@Component({
  selector: 'aca-custom-name-column',
  templateUrl: './name-column.component.html',
  styleUrls: ['name-column.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: ' adf-datatable-content-cell adf-datatable-link adf-name-column'
  }
})
export class CustomNameColumnComponent extends NameColumnComponent implements OnInit, OnDestroy {
  private onDestroy$$ = new Subject<boolean>();

  constructor(
    element: ElementRef,
    private cd: ChangeDetectorRef,
    private actions$: Actions,
    private apiService: AlfrescoApiService
  ) {
    super(element, apiService);
  }

  ngOnInit() {
    this.updateValue();

    this.apiService.nodeUpdated.pipe(takeUntil(this.onDestroy$$)).subscribe((node: any) => {
      const row = this.context.row;
      if (row) {
        const { entry } = row.node;
        const currentId = entry.nodeId || entry.id;
        const updatedId = node.nodeId || node.id;

        if (currentId === updatedId) {
          entry.name = node.name;
          row.node = { entry };
          this.updateValue();
        }
      }
    });

    this.actions$
      .pipe(
        ofType<any>(NodeActionTypes.EditOffline),
        filter(val => {
          return this.node.entry.id === val.payload.entry.id;
        }),
        takeUntil(this.onDestroy$$)
      )
      .subscribe(() => {
        this.cd.detectChanges();
      });
  }

  ngOnDestroy() {
    super.ngOnDestroy();

    this.onDestroy$$.next(true);
    this.onDestroy$$.complete();
  }

  isFile(): boolean {
    return this.node && this.node.entry && !this.node.entry.isFolder;
  }

  isFileWriteLocked(): boolean {
    return isLocked(this.node);
  }
}
