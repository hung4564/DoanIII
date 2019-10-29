import { Component, OnInit } from '@angular/core';
import {
  ObjectDataTableAdapter,
  ObjectDataRow,
  DataRowActionEvent,
  DataCellEvent,
  TranslationService
} from '@alfresco/adf-core';
import { UsersService } from '../users.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersDetailComponent } from '../users-detail/users-detail.component';
import { ConfirmDialogComponent } from '@alfresco/adf-content-services';
import { Store } from '@ngrx/store';
import { AppStore } from 'app/store/states/app.state';
import { SnackbarErrorAction, SnackbarInfoAction } from 'app/store/actions/snackbar.actions';

@Component({
  selector: 'app-users-main',
  templateUrl: './users-main.component.html',
  styleUrls: ['./users-main.component.scss']
})
export class UsersMainComponent implements OnInit {
  data = new ObjectDataTableAdapter([], []);
  constructor(
    private store: Store<AppStore>,
    private _userSv: UsersService,
    public dialog: MatDialog,
    private _transSV: TranslationService
  ) {
    this.getData();
  }
  getData() {
    this._userSv.getUsers().then((results: any) => {
      this.data.setRows(
        results.map(item => {
          return new ObjectDataRow(item);
        })
      );
    });
  }

  onShowRowActionsMenu(event: DataCellEvent) {
    const actionTrans = this._transSV.instant(['APP.ACTIONS.EDIT', 'APP.ACTIONS.DELETE']);
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
      }
    ];
  }
  confirm(data: { title: string; message: string }) {
    return this.dialog.open(ConfirmDialogComponent, {
      data: data,
      minWidth: '250px'
    });
  }
  onExecuteRowAction(event: DataRowActionEvent) {
    const action = event.value.action;
    switch (action.type) {
      case 'APP.ACTIONS.EDIT':
        this.editUser(event.value.row['obj'].id);
        break;
      case 'APP.ACTIONS.DELETE':
        this.confirm({ title: action.title, message: action.message })
          .afterClosed()
          .subscribe(isDelete => {
            if (isDelete) {
              this._userSv.deleteUser(event.value.row['obj'].id).then(
                result => {
                  this.handSuccess('DELETE');
                },
                error => {
                  this.handleError(error, 'DELETE');
                }
              );
            }
          });
        break;
      default:
        break;
    }
  }
  ngOnInit() {}
  handSuccess(typeaction) {
    const key = `APP.MESSAGES.USERS.${typeaction}_SUCCESS`;
    this.store.dispatch(new SnackbarInfoAction(key));
    this.getData();
  }
  handleError(error, typeaction) {
    const err = JSON.parse(JSON.stringify(error));
    let key = `APP.MESSAGES.USERS.${typeaction}_ERROR`;
    switch (err.response.statusCode) {
      case 409:
        key = `APP.MESSAGES.USERS.409`;
        break;
      case 403:
        key = `APP.MESSAGES.USERS.403`;
        break;
      case 404:
        key = `APP.MESSAGES.USERS.404`;
        break;
      default:
        break;
    }
    this.store.dispatch(new SnackbarErrorAction(key));
    this.getData();
  }
  editUser(id) {
    this._userSv.getUser(id).then(result => {
      const edittrans = this._transSV.instant('APP.ACTIONS.EDIT');
      const confirmtrans = this._transSV.instant('APP.DIALOGS.CONFIRM_ACTION_USER', {
        action: edittrans
      });

      const dialogRef = this.dialog.open(UsersDetailComponent, {
        data: { title: edittrans, ...result },
        width: '50%'
      });
      dialogRef.afterClosed().subscribe(doneEdit => {
        if (doneEdit) {
          this.confirm({
            title: edittrans,
            message: confirmtrans
          })
            .afterClosed()
            .subscribe(isEdit => {
              if (isEdit) {
                this._userSv.updateUser(id, doneEdit).then(
                  () => {
                    this.handSuccess('EDIT');
                  },
                  error => {
                    this.handleError(error, 'EDIT');
                  }
                );
              }
            });
        }
      });
    });
  }
  createUser() {
    const createtrans: string = this._transSV.instant('APP.ACTIONS.CREATE');
    const confirmtrans = this._transSV.instant('APP.DIALOGS.CONFIRM_ACTION_USER', {
      action: createtrans.toLowerCase()
    });

    const dialogRef = this.dialog.open(UsersDetailComponent, {
      data: { title: createtrans },
      width: '50%'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.confirm({
          title: createtrans,
          message: confirmtrans
        })
          .afterClosed()
          .subscribe(isCreate => {
            if (isCreate) {
              this._userSv.createUser(result).then(
                () => {
                  this.handSuccess('CREATE');
                },
                error => {
                  this.handleError(error, 'CREATE');
                }
              );
            }
          });
      }
    });
  }
}
