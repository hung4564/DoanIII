import { ExtensionRef } from "@alfresco/adf-extensions";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { RepositoryInfo } from "@alfresco/js-api";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { dependencies } from "../../../../package.json";
import { AppExtensionService } from "app/extensions/app-extension.service.js";
import { ContentApiService } from "app/services/content-api.service.js";
@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["about.component.scss"],
  encapsulation: ViewEncapsulation.None,
  host: { class: "app-about" }
})
export class AboutComponent implements OnInit {
  repository: RepositoryInfo;
  extensions$: Observable<ExtensionRef[]>;
  dependencyEntries: Array<{ name: string; version: string }>;
  statusEntries: Array<{ property: string; value: string }>;
  licenseEntries: Array<{ property: string; value: string }>;

  constructor(
    private contentApi: ContentApiService,
    appExtensions: AppExtensionService
  ) {
    this.extensions$ = appExtensions.references$;
  }

  ngOnInit() {
    this.dependencyEntries = Object.keys(dependencies).map(key => {
      return {
        name: key,
        version: dependencies[key]
      };
    });

    this.contentApi
      .getRepositoryInformation()
      .pipe(map(node => node.entry.repository))
      .subscribe(repository => {
        this.repository = repository;

        this.statusEntries = Object.keys(repository.status).map(key => {
          return {
            property: key,
            value: repository.status[key]
          };
        });

        if (repository.license) {
          this.licenseEntries = Object.keys(repository.license).map(key => {
            return {
              property: key,
              value: repository.license[key]
            };
          });
        }
      });
  }
}
