import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { ModuleInfo } from '@alfresco/js-api';

@Component({
  selector: 'app-module-list',
  templateUrl: './module-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModuleListComponent {
  columns = [
    {
      columnDef: 'id',
      header: 'APP.ABOUT.MODULES.ID',
      cell: (row: ModuleInfo) => `${row.id}`
    },
    {
      columnDef: 'title',
      header: 'APP.ABOUT.MODULES.NAME',
      cell: (row: ModuleInfo) => `${row.title}`
    },
    {
      columnDef: 'version',
      header: 'APP.ABOUT.MODULES.VERSION',
      cell: (row: ModuleInfo) => `${row.version}`
    }
  ];

  displayedColumns = this.columns.map(x => x.columnDef);

  @Input()
  data: Array<ModuleInfo> = [];
}
