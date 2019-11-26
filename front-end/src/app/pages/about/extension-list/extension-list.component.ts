import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { ExtensionRef } from '@alfresco/adf-extensions';

@Component({
  selector: 'app-extension-list',
  templateUrl: './extension-list.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExtensionListComponent {
  columns = [
    {
      columnDef: 'id',
      header: 'APP.ABOUT.PLUGINS.ID',
      cell: (row: ExtensionRef) => `${row.$id}`
    },
    {
      columnDef: 'name',
      header: 'APP.ABOUT.PLUGINS.NAME',
      cell: (row: ExtensionRef) => `${row.$name}`
    },
    {
      columnDef: 'version',
      header: 'APP.ABOUT.PLUGINS.VERSION',
      cell: (row: ExtensionRef) => `${row.$version}`
    },
    {
      columnDef: 'vendor',
      header: 'APP.ABOUT.PLUGINS.VENDOR',
      cell: (row: ExtensionRef) => `${row.$vendor}`
    },
    {
      columnDef: 'license',
      header: 'APP.ABOUT.PLUGINS.LICENSE',
      cell: (row: ExtensionRef) => `${row.$license}`
    },
    {
      columnDef: 'runtime',
      header: 'APP.ABOUT.PLUGINS.RUNTIME',
      cell: (row: ExtensionRef) => `${row.$runtime}`
    }
  ];

  displayedColumns = this.columns.map(x => x.columnDef);

  @Input()
  data: Array<ExtensionRef> = [];
}
