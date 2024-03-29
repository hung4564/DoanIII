import { Injectable } from '@angular/core';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { Store } from '@ngrx/store';
import { AppStore } from 'app/store/states/app.state';
import { SnackbarErrorAction, SnackbarInfoAction } from 'app/store/actions/snackbar.actions';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '@alfresco/adf-content-services';

export interface Webscript {
  httpMethod: string;
  scriptPath: string;
  scriptArgs?: any;
  contextRoot?: string;
  servicePath?: string;
  postBody?: any;
}

@Injectable({
  providedIn: 'root'
})
export class HandleService {
  constructor(
    private apiService: AlfrescoApiService,
    private store: Store<any>,
    public dialog: MatDialog
  ) {}
  async handleApi(webScript: Webscript): Promise<any> {
    return await this.apiService
      .getInstance()
      .webScript.executeWebScript(
        webScript.httpMethod,
        webScript.scriptPath,
        webScript.scriptArgs,
        webScript.contextRoot,
        webScript.servicePath,
        webScript.postBody
      );
  }
  showError(error) {
    const err = JSON.parse(JSON.parse(JSON.stringify(error)).response.text);
    const key = err.error.errorKey;
    this.store.dispatch(new SnackbarErrorAction(key));
  }
  showSuccess(key: string) {
    this.store.dispatch(new SnackbarInfoAction(key));
  }
  confirm(data: { title: string; message: string }) {
    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: data,
      minWidth: '250px'
    });
    return dialog.afterClosed();
  }
}
