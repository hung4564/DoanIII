import { Directive, HostListener } from '@angular/core';
import { SetSelectedNodesAction } from 'app/store';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { DocumentListComponent } from '@alfresco/adf-content-services';
import { UserPreferencesService } from '@alfresco/adf-core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Directive({
  selector: '[acaDocumentList]'
})
export class DocumentListDirective {
  private isLibrary = false;

  onDestroy$ = new Subject<boolean>();

  get sortingPreferenceKey(): string {
    return this.route.snapshot.data.sortingPreferenceKey;
  }

  constructor(
    private store: Store<any>,
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

    if (this.sortingPreferenceKey) {
      const current = this.documentList.sorting;

      const key = this.preferences.get(`${this.sortingPreferenceKey}.sorting.key`, current[0]);
      const direction = this.preferences.get(
        `${this.sortingPreferenceKey}.sorting.direction`,
        current[1]
      );

      this.documentList.sorting = [key, direction];
      // TODO: bug in ADF, the `sorting` binding is not updated when changed from code
      this.documentList.data.setSorting({ key, direction });
    }

    this.documentList.ready.pipe(takeUntil(this.onDestroy$)).subscribe(() => this.onReady());

    // this.content.reload.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
    //   this.reload();
    // });
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  @HostListener('sorting-changed', ['$event'])
  onSortingChanged(event: CustomEvent) {
    if (this.sortingPreferenceKey) {
      this.preferences.set(`${this.sortingPreferenceKey}.sorting.key`, event.detail.key);
      this.preferences.set(
        `${this.sortingPreferenceKey}.sorting.direction`,
        event.detail.direction
      );
    }
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
      return node;
    });

    this.store.dispatch(new SetSelectedNodesAction(selection));
  }

  private reload() {
    this.documentList.resetSelection();
    this.store.dispatch(new SetSelectedNodesAction([]));
    this.documentList.reload();
  }
}
