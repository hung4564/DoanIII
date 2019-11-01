import { Component, OnInit } from '@angular/core';
import {
  ObjectDataTableAdapter,
  TranslationService,
  ObjectDataRow,
  DataCellEvent,
  DataRowActionEvent,
  PaginationModel,
  AppConfigService
} from '@alfresco/adf-core';
import { GroupsService } from '../groups.service';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '@alfresco/adf-content-services';
import { GroupsDetailComponent } from '../groups-detail/groups-detail.component';
import { GroupViewListComponent } from '../group-view-list/group-view-list.component';

@Component({
  selector: 'app-groups-main',
  templateUrl: './groups-main.component.html',
  styleUrls: ['./groups-main.component.scss'],
  host: {
    class: 'app-layout'
  }
})
export class GroupsMainComponent implements OnInit {
  data = new ObjectDataTableAdapter([], []);
  pagination: PaginationModel = new PaginationModel();
  sizes: number[];
  loading = false;
  constructor(
    private _groupSv: GroupsService,
    private appConfigService: AppConfigService,
    public dialog: MatDialog,
    private _transSV: TranslationService
  ) {
    this.sizes = this.appConfigService.get<number[]>('pagination.supportedPageSizes');

    const pagination = {
      skipCount: 0,
      maxItems: this.appConfigService.get<number>('pagination.size')
    };
    this.pagination = new PaginationModel(pagination);
    this.getData(pagination);
  }

  ngOnInit() {}
  getData(pagination) {
    this.loading = true;
    this._groupSv.getGroups(pagination).then((response: any) => {
      const results = this._groupSv.formatData(response.list.entries);
      this.pagination = new PaginationModel(response.list.pagination);
      this.data.setRows(
        results.map(item => {
          return new ObjectDataRow(item);
        })
      );
      this.loading = false;
    });
  }

  onShowRowActionsMenu(event: DataCellEvent) {
    const actionTrans = this._transSV.instant([
      'APP.ACTIONS.EDIT',
      'APP.ACTIONS.DELETE',
      'APP.ACTIONS.ADD'
    ]);
    const editMess = this._transSV.instant('APP.DIALOGS.CONFIRM_ACTION_USER', {
      action: actionTrans['APP.ACTIONS.EDIT']
    });
    const deleteMess = this._transSV.instant('APP.DIALOGS.CONFIRM_ACTION_USER', {
      action: actionTrans['APP.ACTIONS.DELETE']
    });
    event.value.actions = [
      {
        title: actionTrans['APP.ACTIONS.EDIT'],
        type: 'APP.ACTIONS.EDIT',
        message: editMess
      },
      {
        title: actionTrans['APP.ACTIONS.DELETE'],
        type: 'APP.ACTIONS.DELETE',
        message: deleteMess
      },
      {
        title: actionTrans['APP.ACTIONS.ADD'],
        type: 'APP.ACTIONS.ADD',
        message: deleteMess
      }
    ];
  }
  onExecuteRowAction(event: DataRowActionEvent) {
    const action = event.value.action;
    switch (action.type) {
      case 'APP.ACTIONS.EDIT':
        this.editUser(event.value.row['obj'].id);
        break;
      case 'APP.ACTIONS.DELETE':
        this.deleteGroup(action, event.value.row['obj'].id);
        break;
      case 'APP.ACTIONS.ADD':
        this.openViewDialog(action, event.value.row['obj'].id);
        break;
      default:
        break;
    }
  }
  openViewDialog(action, id_group: string) {
    this.dialog.open(GroupViewListComponent, {
      data: { title: action.title, id: id_group },
      minWidth: '550px'
    });
  }
  deleteGroup(action, id) {
    this.confirm({ title: action.title, message: action.message }).subscribe(isDelete => {
      if (isDelete) {
        this.loading = true;
        this._groupSv.deleteGroup(id).then(
          () => {
            this.loading = false;
            this.pagination.skipCount = 0;
            this.getData(this.pagination);
          },
          error => {
            this.loading = false;
          }
        );
      }
    });
  }
  editUser(id) {
    const titletrans: string = this._transSV.instant(`APP.ACTIONS.EDIT`);
    const confirmtrans = this._transSV.instant('APP.DIALOGS.CONFIRM_ACTION_GROUP', {
      action: titletrans.toLowerCase()
    });
    this._groupSv.getGroup(id).then(result => {
      this.openDialog('EDIT', result).subscribe(dataEdit => {
        if (dataEdit) {
          this.confirm({ title: titletrans, message: confirmtrans }).subscribe(isEdit => {
            if (isEdit) {
              this._groupSv.updateGroup(id, dataEdit).then(
                () => {
                  this.loading = false;
                  this.getData(this.pagination);
                },
                error => {
                  this.loading = false;
                }
              );
            }
          });
        }
      });
    });
  }
  onChangePagination(e: PaginationModel) {
    this.getData(e);
  }

  confirm(data: { title: string; message: string }) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: data,
      minWidth: '250px'
    });
    return dialog.afterClosed();
  }
  openDialog(titletrans, data) {
    return this.dialog
      .open(GroupsDetailComponent, {
        data: { title: titletrans, ...data },
        width: '50%'
      })
      .afterClosed();
  }
  createGroup() {
    const createtrans: string = this._transSV.instant('APP.ACTIONS.CREATE');
    const confirmtrans = this._transSV.instant('APP.DIALOGS.CONFIRM_ACTION_GROUP', {
      action: createtrans.toLowerCase()
    });

    const dialogRef = this.dialog.open(GroupsDetailComponent, {
      data: { title: createtrans },
      width: '50%'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.confirm({
          title: createtrans,
          message: confirmtrans
        }).subscribe(isCreate => {
          if (isCreate) {
            this.loading = true;
            this._groupSv.createGroup(result).then(
              () => {
                this.loading = false;
                this.getData(this.pagination);
              },
              error => {
                this.loading = false;
              }
            );
          }
        });
      }
    });
  }
}
