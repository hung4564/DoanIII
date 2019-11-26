import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

export interface StatusData {
  property: string;
  value: string;
}

@Component({
  selector: 'app-status-list',
  templateUrl: './status-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusListComponent {
  columns = [
    {
      columnDef: 'property',
      header: 'APP.ABOUT.STATUS.PROPERTY',
      cell: (row: StatusData) => `${row.property}`
    },
    {
      columnDef: 'value',
      header: 'APP.ABOUT.STATUS.VALUE',
      cell: (row: StatusData) => `${row.value}`
    }
  ];

  displayedColumns = this.columns.map(x => x.columnDef);

  @Input()
  data: Array<StatusData> = [];
}
