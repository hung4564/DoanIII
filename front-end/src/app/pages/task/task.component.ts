import { Component, OnInit, ViewChild } from "@angular/core";
import { PageComponent } from "../page.component";
import { ContentManagementService } from "app/services/content-management.service";
import { Store } from "@ngrx/store";
import { AppExtensionService } from "app/extensions/app-extension.service";
import { ContentApiService } from "app/services/content-api.service";
import { UserPreferencesService } from "@alfresco/adf-core";
import { SearchFilterComponent } from "@alfresco/adf-content-services";
import { TaskFilter } from "./task-filter/task-filter.component";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-task",
  templateUrl: "./task.component.html",
  styleUrls: ["./task.component.scss"],
  host: {
    class: "app-layout"
  }
})
export class TaskComponent extends PageComponent implements OnInit {
  columns: any[] = [];
  list: any;
  isLoading = false;
  constructor(
    content: ContentManagementService,
    private router: Router,
    private route: ActivatedRoute,
    private userPreferenceService: UserPreferencesService,
    store: Store<any>,
    extensions: AppExtensionService,
    private contentApi: ContentApiService
  ) {
    super(store, extensions, content);
    this.pagination.maxItems = this.userPreferenceService.paginationSize;
    this.getList(this.pagination);
  }

  ngOnInit() {
    super.ngOnInit();
    this.content.reload.subscribe(() => {
      this.getList(this.pagination);
    });
    this.columns = this.extensions.documentListPresets.tasks || [];
  }
  getList(pagination, filter?) {
    this.isLoading = true;
    const opt = { ...pagination, ...filter };
    this.contentApi.getTasks(opt).subscribe(
      result => {
        console.log("TCL: TaskComponent -> getList -> result", result.list.entries);
        this.list = result;
        this.pagination = result.list.pagination;
        this.isLoading = false;
      },
      err => {
        this.list = null;
        this.pagination = {};
        this.isLoading = false;
      }
    );
  }
  onChangePagination(e: any) {
    this.getList(e);
  }
  filterChange(e: TaskFilter[]) {
    const filterString: string = e
      .filter(x => x.value)
      .map(x => {
        return `${x.field} ${x.opt} ${x.value}`;
      })
      .join(" AND ");
    if (filterString) {
      this.getList(this.pagination, { where: `(${filterString})` });
    } else {
      this.getList(this.pagination);
    }
  }
  onNodeDoubleClick(node: any) {
    if (node && node.entry) {
      this.navigate(node.entry.id);
    }
  }
  navigate(nodeId: string = null) {
    const commands = ["./"];

    if (nodeId) {
      commands.push(nodeId);
    }

    this.router.navigate(commands, {
      relativeTo: this.route.parent
    });
  }
}
