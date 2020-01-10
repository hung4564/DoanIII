import {
  AppConfigService,
  PaginationComponent,
  PaginationModel,
  UserPreferencesService
} from "@alfresco/adf-core";
import { Directive, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

@Directive({
  selector: "[appPagination]"
})
export class PaginationDirective implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  constructor(
    private pagination: PaginationComponent,
    private preferences: UserPreferencesService,
    private config: AppConfigService
  ) {}

  ngOnInit() {
    this.pagination.supportedPageSizes = this.config.get(
      "pagination.supportedPageSizes"
    );
    this.subscriptions.push(
      this.pagination.changePageSize.subscribe((event: PaginationModel) => {
        this.preferences.paginationSize = event.maxItems;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }
}
