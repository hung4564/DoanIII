import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';

export interface PackageInfo {
  name: string;
  version: string;
}

@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackageListComponent {
  columns = [
    {
      columnDef: 'title',
      header: 'APP.ABOUT.PACKAGES.NAME',
      cell: (row: PackageInfo) => `${row.name}`
    },
    {
      columnDef: 'version',
      header: 'APP.ABOUT.PACKAGES.VERSION',
      cell: (row: PackageInfo) => `${row.version}`
    }
  ];

  displayedColumns = this.columns.map(x => x.columnDef);

  @Input()
  data: Array<PackageInfo> = [];
}
