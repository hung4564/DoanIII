import { Component, OnInit, Input } from "@angular/core";
import { ShareDataTableAdapter, ShareDataRow } from "@alfresco/adf-content-services";
import { DataColumnComponent } from "@alfresco/adf-core";
import { AppExtensionService } from "app/extensions/app-extension.service";
import { Site, SiteMemberEntry, SiteMemberPaging } from "@alfresco/js-api";
import { MatSelectChange } from "@angular/material";
import { Store } from "@ngrx/store";
import { getUserProfile } from "app/store/selectors/app.selector";

@Component({
  selector: "app-changeLibraryRole",
  templateUrl: "./changeLibraryRole.component.html",
  styleUrls: ["./changeLibraryRole.component.scss"]
})
export class ChangeLibraryRoleComponent implements OnInit {
  @Input() context: {
    data: ShareDataTableAdapter;
    row: ShareDataRow;
    col: DataColumnComponent;
    action: ActionRef;
  };
  action: ActionRef;
  roleSelected: Site.RoleEnum;
  roles = Site.RoleEnum;
  disabled = true;
  data: SiteMemberEntry;

  constructor(private extensions: AppExtensionService, private store: Store<any>) {}

  ngOnInit() {
    const { action } = this.context;
    this.data = <SiteMemberEntry>(<unknown>this.context.row.node);
    this.store.select(getUserProfile).subscribe(profile => {
      this.disabled = this.data.entry.id == profile.id;
    });
    this.roleSelected = this.context.row.getValue(this.context.col.key);
    this.action = action;
    if (this.action.rules && this.action.rules.enabled) {
      this.disabled = this.disabled && !this.extensions.checkRule(this.action.rules.enabled);
    }
  }
  runAction(data?: any) {
    if (this.action && this.action.click) {
      this.extensions.runActionById(this.action.click, data);
    }
  }
  roleChange(e: MatSelectChange) {
    const personId = this.context.row.node.entry.id;
    if (personId) this.runAction({ personId: personId, role: e.value });
  }
}
export interface ActionRef {
  click: string;
  title: string;
  rules: { enabled: string };
}
