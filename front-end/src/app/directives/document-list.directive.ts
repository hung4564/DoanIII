import { Directive, HostListener } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { UserPreferencesService } from '@alfresco/adf-core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ContentManagementService } from 'app/services/content-management.service';
import { SetSelectedNodesAction } from 'app/store/actions/node.actions';

@Directive({
  selector: '[appDocumentList]'
})
export class DocumentListDirective {
  private isLibrary = false;
  private isPeople = false;
  private isGroup = false;
  onDestroy$ = new Subject<boolean>();

  constructor(
    private store: Store<any>,
    private content: ContentManagementService,
    private documentList: DocumentListComponent,
    private preferences: UserPreferencesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.documentList.stickyHeader = true;
    this.documentList.includeFields = ['isFavorite', 'aspectNames'];
    this.isLibrary =
      this.documentList.currentFolderId === '-mysites-' ||
      // workaround for custom node list
      this.router.url.endsWith('/libraries') ||
      this.router.url.startsWith('/search-libraries');
    this.isPeople = this.router.url.startsWith('/people');
    this.isGroup = this.router.url.startsWith('/groups');
    this.documentList.ready.pipe(takeUntil(this.onDestroy$)).subscribe(() => this.onReady());

    this.content.reload.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.reload();
    });
    this.content.reset.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.reset();
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  @HostListener('node-select', ['$event'])
  onNodeSelect(event: CustomEvent) {
    if (!!event.detail && !!event.detail.node) {
      this.updateSelection();
    }
  }

  @HostListener('node-unselect')
  onNodeUnselect() {
    this.updateSelection();
  }

  onReady() {
    this.updateSelection();
  }

  private updateSelection() {
    const selection = this.documentList.selection.map(node => {
      node['isLibrary'] = this.isLibrary;
      node['isPeople'] = this.isPeople;
      node['isGroup'] = this.isGroup;
      return node;
    });

    this.store.dispatch(new SetSelectedNodesAction(selection));
  }

  private reload() {
    this.documentList.resetSelection();
    this.store.dispatch(new SetSelectedNodesAction([]));
    this.documentList.reload();
  }
  private reset() {
    this.documentList.resetSelection();
  }
}
