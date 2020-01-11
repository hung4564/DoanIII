import { TranslationService } from "@alfresco/adf-core";
import { MinimalNodeEntity, PathInfo } from "@alfresco/js-api";
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import { Store } from "@ngrx/store";
import { ContentApiService } from "app/services/content-api.service";
import { BehaviorSubject, Observable, of } from "rxjs";

@Component({
  selector: "app-location-link",
  template: `
    <a
      href=""
      [title]="nodeLocation$ | async"
      (click)="goToLocation()"
      class="adf-datatable-cell-value"
    >
      {{ displayText | async | translate }}
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: "app-location-link adf-location-cell adf-datatable-content-cell"
  }
})
export class LocationLinkComponent implements OnInit {
  private _path: PathInfo;

  nodeLocation$ = new BehaviorSubject("");

  @Input()
  context: any;

  @Input()
  link: any[];

  @Input()
  displayText: Observable<string>;

  @Input()
  tooltip: Observable<string>;

  @HostListener("mouseenter")
  onMouseEnter() {
    this.getTooltip(this._path);
  }

  constructor(
    private store: Store<any>,
    private contentApi: ContentApiService,
    private translationService: TranslationService
  ) {}

  goToLocation() {
    if (this.context) {
      const node: MinimalNodeEntity = this.context.row.node;
    }
  }

  ngOnInit() {
    if (this.context) {
      const node: MinimalNodeEntity = this.context.row.node;
      if (node && node.entry && node.entry.path) {
        const path = node.entry.path;

        if (path && path.name && path.elements) {
          this.displayText = this.getDisplayText(path);
          this._path = path;
        } else {
          this.displayText = of("APP.BROWSE.SEARCH.UNKNOWN_LOCATION");
        }
      }
    }
  }

  private getDisplayText(path: PathInfo): Observable<string> {
    const elements = path.elements.map(e => e.name);

    // for admin users
    if (elements.length === 1 && elements[0] === "Company Home") {
      return of("APP.BROWSE.PERSONAL.TITLE");
    }

    // for non-admin users
    if (
      elements.length === 3 &&
      elements[0] === "Company Home" &&
      elements[1] === "User Homes"
    ) {
      return of("APP.BROWSE.PERSONAL.TITLE");
    }

    const result = elements[elements.length - 1];

    if (result === "documentLibrary") {
      const fragment = path.elements[path.elements.length - 2];

      return new Observable<string>(observer => {
        this.contentApi.getNodeInfo(fragment.id).subscribe(
          node => {
            observer.next(
              node.properties["cm:title"] || node.name || fragment.name
            );
            observer.complete();
          },
          () => {
            observer.next(fragment.name);
            observer.complete();
          }
        );
      });
    }

    return of(result);
  }
  private getTooltip(path: PathInfo) {
    if (!path) {
      return;
    }

    let result: string = null;

    const elements = path.elements.map(e => Object.assign({}, e));
    const personalFiles = this.translationService.instant(
      "APP.BROWSE.PERSONAL.TITLE"
    );
    const fileLibraries = this.translationService.instant(
      "APP.BROWSE.LIBRARIES.TITLE"
    );

    if (elements[0].name === "Company Home") {
      elements[0].name = personalFiles;

      if (elements.length > 2) {
        if (elements[1].name === "Sites") {
          const fragment = elements[2];
          this.contentApi.getNodeInfo(fragment.id).subscribe(
            node => {
              elements.splice(0, 2);
              elements[0].name =
                node.properties["cm:title"] || node.name || fragment.name;
              elements.splice(1, 1);
              elements.unshift({ id: null, name: fileLibraries });

              result = elements.map(e => e.name).join("/");
              this.nodeLocation$.next(result);
            },
            () => {
              elements.splice(0, 2);
              elements.unshift({ id: null, name: fileLibraries });
              elements.splice(2, 1);

              result = elements.map(e => e.name).join("/");
              this.nodeLocation$.next(result);
            }
          );
        }

        if (elements[1].name === "User Homes") {
          elements.splice(0, 3);
          elements.unshift({ id: null, name: personalFiles });
        }
      }
    }

    result = elements.map(e => e.name).join("/");
    this.nodeLocation$.next(result);
  }
}
