export interface LicenseData {
  property: string;
  value: string;
}

import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

@Component({
  selector: 'app-license-list',
  templateUrl: './license-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LicenseListComponent {
  columns = [
    {
      columnDef: 'property',
      header: 'APP.ABOUT.LICENSE.PROPERTY',
      cell: (row: LicenseData) => `${row.property}`
    },
    {
      columnDef: 'value',
      header: 'APP.ABOUT.LICENSE.VALUE',
      cell: (row: LicenseData) => `${row.value}`
    }
  ];

  displayedColumns = this.columns.map(x => x.columnDef);

  @Input()
  data: Array<LicenseData> = [];
}
