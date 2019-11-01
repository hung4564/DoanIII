import { Component, OnInit } from '@angular/core';
import {
  ObjectDataTableAdapter,
  ObjectDataRow,
  DataRowActionEvent,
  DataCellEvent,
  TranslationService,
  PaginationModel,
  AppConfigService
} from '@alfresco/adf-core';
import { UsersService } from '../users.service';
import { MatDialog } from '@angular/material/dialog';
import { UsersDetailComponent } from '../users-detail/users-detail.component';
import { ConfirmDialogComponent } from '@alfresco/adf-content-services';

@Component({
  selector: 'app-users-main',
  templateUrl: './users-main.component.html',
  styleUrls: ['./users-main.component.scss'],
  host: {
    class: 'app-layout'
  }
})
export class UsersMainComponent implements OnInit {
  data = new ObjectDataTableAdapter([], []);
  pagination: PaginationModel = new PaginationModel();
  sizes: number[];
  loading = false;
  constructor(
    private appConfigService: AppConfigService,
    private _userSv: UsersService,
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
  getData(pagination: PaginationModel) {
    this.loading = true;
    this._userSv.getUsers(pagination).then((response: any) => {
      const results = this._userSv.formatData(response.list.entries);
      this.pagination = new PaginationModel(response.list.pagination);
      this.data.setRows(
        results.map(item => {
          return new ObjectDataRow(item);
        })
      );
      this.loading = false;
    });
  }

  onChangePagination(e: PaginationModel) {
    this.getData(e);
  }
  onShowRowActionsMenu(event: DataCellEvent) {
    const actionTrans = this._transSV.instant(['APP.ACTIONS.EDIT', 'APP.ACTIONS.DELETE']);
    const editMess = this._transSV.instant('APP.DIALOGS.CONFIRM_ACTION_USER', {
      action: actionTrans['APP.ACTIONS.EDIT'].toLowerCase()
    });
    const deleteMess = this._transSV.instant('APP.DIALOGS.CONFIRM_ACTION_USER', {
      action: actionTrans['APP.ACTIONS.DELETE'].toLowerCase()
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
      }
    ];
  }
  onExecuteRowAction(event: DataRowActionEvent) {
    const action = event.value.action;
    switch (action.type) {
      case 'APP.ACTIONS.EDIT':
        this.editUser(event.value.row['obj'].id, action);
        break;
      case 'APP.ACTIONS.DELETE':
        this.deleteUser(event.value.row['obj'].id, action);
        break;
      default:
        break;
    }
  }
  ngOnInit() {}
  editUser(id: string, action) {
    this._userSv.getUser(id).then(result => {
      this.openDialog(action.title, result).subscribe(dataEdit => {
        if (dataEdit) {
          this.confirm({ title: action.title, message: action.message }).subscribe(isEdit => {
            if (isEdit) {
              this._userSv.updateUser(id, dataEdit).then(
                () => {
                  this.loading = false;
                  this.getData(this.pagination);
                },
                () => {
                  this.loading = false;
                }
              );
            }
          });
        }
      });
    });
  }
  deleteUser(id: string, action) {
    this.confirm({ title: action.title, message: action.message }).subscribe(isDelete => {
      if (isDelete) {
        this._userSv.deleteUser(id).then(
          () => {
            this.loading = false;
            this.pagination.skipCount = 0;
            this.getData(this.pagination);
          },
          () => {
            this.loading = false;
          }
        );
      }
    });
  }
  createUser() {
    const createtrans: string = this._transSV.instant('APP.ACTIONS.CREATE');
    const confirmtrans = this._transSV.instant('APP.DIALOGS.CONFIRM_ACTION_GROUP', {
      action: createtrans.toLowerCase()
    });
    this.openDialog(createtrans, undefined).subscribe(dataCreate => {
      if (dataCreate) {
        this.confirm({ title: createtrans, message: confirmtrans }).subscribe(isEdit => {
          if (isEdit) {
            this._userSv.createUser(dataCreate).then(
              () => {
                this.loading = false;
                this.getData(this.pagination);
              },
              () => {
                this.loading = false;
              }
            );
          }
        });
      }
    });
  }
  confirm(data: { title: string; message: string }) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: data,
      minWidth: '250px'
    });
    return dialog.afterClosed();
  }
  openDialog(titletrans, data?) {
    return this.dialog
      .open(UsersDetailComponent, {
        data: { title: titletrans, ...data },
        width: '50%'
      })
      .afterClosed();
  }
}
