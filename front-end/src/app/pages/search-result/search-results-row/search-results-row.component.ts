import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { MinimalNodeEntity } from '@alfresco/js-api';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subject } from 'rxjs';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ViewNodeAction } from 'app/store/actions/viewer.actions';
import { NavigateToFolder } from 'app/store/actions/router.actions';

@Component({
  selector: 'app-search-results-row',
  templateUrl: './search-results-row.component.html',
  styleUrls: ['./search-results-row.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'app-search-results-row' }
})
export class SearchResultsRowComponent implements OnInit, OnDestroy {
  private node: MinimalNodeEntity;
  private onDestroy$ = new Subject<boolean>();

  @Input()
  context: any;

  name$ = new BehaviorSubject<string>('');
  title$ = new BehaviorSubject<string>('');

  constructor(
    private store: Store<any>,
    private alfrescoApiService: AlfrescoApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.updateValues();

    this.alfrescoApiService.nodeUpdated.pipe(takeUntil(this.onDestroy$)).subscribe((node: any) => {
      const row = this.context.row;
      if (row) {
        const { entry } = row.node;

        if (entry.id === node.id) {
          entry.name = node.name;
          entry.properties = Object.assign({}, node.properties);

          this.updateValues();
        }
      }
    });
  }

  private updateValues() {
    this.node = this.context.row.node;

    const { name, properties } = this.node.entry;
    const title = properties ? properties['cm:title'] : '';

    this.name$.next(name);

    if (title !== name) {
      this.title$.next(title ? `( ${title} )` : '');
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  get description(): string {
    const { properties } = this.node.entry;
    return properties ? properties['cm:description'] : '';
  }

  get modifiedAt(): Date {
    return this.node.entry.modifiedAt;
  }

  get size(): number {
    const { content } = this.node.entry;
    return content ? content.sizeInBytes : null;
  }

  get user(): string {
    return this.node.entry.modifiedByUser.displayName;
  }

  get isFile(): boolean {
    return this.node.entry.isFile;
  }

  showPreview(event: MouseEvent) {
    event.stopPropagation();
    this.store.dispatch(new ViewNodeAction(this.node.entry.id, { location: this.router.url }));
  }

  navigate(event: MouseEvent) {
    event.stopPropagation();
    this.store.dispatch(new NavigateToFolder(this.node));
  }
}
