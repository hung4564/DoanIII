import { Component, Input, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MinimalNodeEntryEntity } from '@alfresco/js-api';
import { AppConfigService, NotificationService } from '@alfresco/adf-core';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { ContentMetadataService } from '@alfresco/adf-content-services';
import { takeUntil } from 'rxjs/operators';
import { NodePermissionService } from 'app/services/node-permission.service';
import { AppExtensionService } from 'app/extensions/app-extension.service';
import { AppStore } from 'app/store/states/app.state';
import { isLocked } from 'app/utils/node.utils';
import { infoDrawerMetadataAspect } from 'app/store/selectors/app.selector';

@Component({
  selector: 'app-metadata-tab',
  template: `
    <adf-content-metadata-card
      [readOnly]="!canUpdateNode"
      [preset]="'custom'"
      [node]="node"
      [displayAspect]="displayAspect$ | async"
    >
    </adf-content-metadata-card>
  `,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-metadata-tab' }
})
export class MetadataTabComponent implements OnInit, OnDestroy {
  protected onDestroy$ = new Subject<boolean>();

  @Input()
  node: MinimalNodeEntryEntity;

  displayAspect$: Observable<string>;

  constructor(
    private permission: NodePermissionService,
    protected extensions: AppExtensionService,
    private appConfig: AppConfigService,
    private store: Store<AppStore>,
    private notificationService: NotificationService,
    private contentMetadataService: ContentMetadataService
  ) {
    if (this.extensions.contentMetadata) {
      this.appConfig.config['content-metadata'] = this.extensions.contentMetadata;
    }
    this.displayAspect$ = this.store.select(infoDrawerMetadataAspect);
  }

  get canUpdateNode(): boolean {
    if (this.node && !isLocked({ entry: this.node })) {
      return this.permission.check(this.node, ['update']);
    }

    return false;
  }

  ngOnInit() {
    this.contentMetadataService.error
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((err: { message: string }) => {
        this.notificationService.showError(err.message);
      });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
