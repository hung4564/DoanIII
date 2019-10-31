import { Component, OnInit } from '@angular/core';
import {
  ObjectDataTableAdapter,
  PaginationModel,
  AppConfigService,
  TranslationService,
  ObjectDataRow,
  DataCellEvent,
  DataRowActionEvent
} from '@alfresco/adf-core';
import { MatDialog } from '@angular/material';
import { SitesService } from '../sites.service';
import { SitesDetailComponent } from '../sites-detail/sites-detail.component';
import { Site } from '@alfresco/js-api';
@Component({
  selector: 'app-sites-main',
  templateUrl: './sites-main.component.html',
  styleUrls: ['./sites-main.component.scss'],
  host: {
    class: 'app-layout'
  }
})
export class SitesMainComponent implements OnInit {
  data = new ObjectDataTableAdapter([], []);
  pagination: PaginationModel = new PaginationModel();
  sizes: number[];
  loading = false;
  ob = {
    next(response) {},
    error(err) {},
    complete() {
      this.getData(this.pagination);
    }
  };
  constructor(
    private _sitesSv: SitesService,
    private appConfigService: AppConfigService,
    public dialog: MatDialog,
    private _transSV: TranslationService
  ) {
    this.sizes = this.appConfigService.get<number[]>('pagination.supportedPageSizes');

    const pagination = {
      skipCount: 0,
      maxItems: this.appConfigService.get<number[]>('pagination.size')
    };
    this.pagination = new PaginationModel(pagination);
    this.getData(pagination);
  }
  getData(pagination) {
    this.loading = true;
    this._sitesSv.getSites(pagination).subscribe(response => {
      this.data.setRows(
        response.list.entries.map(x => {
          return new ObjectDataRow(this._sitesSv.formatItem(x.entry));
        })
      );
      this.pagination = new PaginationModel(response.list.pagination);
      this.loading = false;
    });
  }
  onChangePagination(e: PaginationModel) {
    this.getData(e);
  }

  onShowRowActionsMenu(event: DataCellEvent) {
    const actionTrans = this._transSV.instant([
      'APP.ACTIONS.EDIT',
      'APP.ACTIONS.DELETE',
      'APP.ACTIONS.ADD'
    ]);
    event.value.actions = [
      {
        title: actionTrans['APP.ACTIONS.EDIT'],
        type: 'APP.ACTIONS.EDIT'
      },
      {
        title: actionTrans['APP.ACTIONS.DELETE'],
        type: 'APP.ACTIONS.DELETE'
      },
      {
        title: actionTrans['APP.ACTIONS.ADD'],
        type: 'APP.ACTIONS.ADD'
      }
    ];
  }
  onExecuteRowAction(event: DataRowActionEvent) {
    const action = event.value.action;
    switch (action.type) {
      case 'APP.ACTIONS.EDIT':
        this.editSite(action, event.value.row['obj'].id);
        break;
      case 'APP.ACTIONS.DELETE':
        this.deleteSite(event.value.row['obj'].id);
        // this.deleteGroup(action, event.value.row['obj'].id);
        break;
      case 'APP.ACTIONS.ADD':
        // this.openViewDialog(action, event.value.row['obj'].id);
        break;
      default:
        break;
    }
  }
  createSite() {
    const createtrans: string = this._transSV.instant('APP.ACTIONS.CREATE');
    this.openDialog(createtrans, undefined).subscribe(dataCreate => {
      if (dataCreate) {
        this._sitesSv.createSite(dataCreate).subscribe(
          result => {},
          e => {},
          () => {
            this.getData(this.pagination);
          }
        );
      }
    });
  }
  editSite(action: { title: string }, id: string) {
    this._sitesSv.getSite(id).subscribe(result => {
      this.openDialog(action.title, result).subscribe(dataEdit => {
        if (dataEdit) {
          this._sitesSv.updateSite(id, dataEdit).subscribe(
            result => {},
            e => {},
            () => {
              this.getData(this.pagination);
            }
          );
        }
      });
    });
  }
  deleteSite(id: string) {
    this._sitesSv.deleteSite(id).subscribe(
      result => {},
      e => {},
      () => {
        this.getData(this.pagination);
      }
    );
  }
  openDialog(titletrans: string, data?: Site) {
    return this.dialog
      .open(SitesDetailComponent, {
        data: { titledialog: titletrans, data: data || {} },
        width: '50%'
      })
      .afterClosed();
  }
  ngOnInit() {}
}
