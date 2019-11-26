import { AlfrescoApiService } from '@alfresco/adf-core';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { SharedLinkEntry } from '@alfresco/js-api';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { forkJoin, from, of } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';
import { AppExtensionService } from 'app/extensions/app-extension.service';
import { SetSelectedNodesAction } from 'app/store/actions/node.action';
import { getAppSelection } from 'app/store/selectors/app.selector';
@Component({
  selector: 'app-shared-link-view',
  templateUrl: 'shared-link-view.component.html',
  styleUrls: ['shared-link-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-shared-link-view' }
})
export class SharedLinkViewComponent implements OnInit {
  sharedLinkId: string = null;
  viewerToolbarActions: ContentActionRef[] = [];

  constructor(
    private route: ActivatedRoute,
    private store: Store<any>,
    private extensions: AppExtensionService,
    private alfrescoApiService: AlfrescoApiService
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        flatMap(params =>
          forkJoin(
            from(this.alfrescoApiService.sharedLinksApi.getSharedLink(params.id)),
            of(params.id)
          ).pipe(catchError(() => of([null, params.id])))
        )
      )
      .subscribe(([sharedEntry, sharedId]: [SharedLinkEntry, string]) => {
        if (sharedEntry) {
          this.store.dispatch(new SetSelectedNodesAction([<any>sharedEntry]));
        }
        this.sharedLinkId = sharedId;
      });

    this.store.select(getAppSelection).subscribe(selection => {
      if (!selection.isEmpty) {
        this.viewerToolbarActions = this.extensions.getSharedLinkViewerToolbarActions();
      }
    });
  }

  trackByActionId(_: number, action: ContentActionRef) {
    return action.id;
  }
}
