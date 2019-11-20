import { Component, OnInit, Input } from "@angular/core";
import { ShareDataTableAdapter, ShareDataRow } from "@alfresco/adf-content-services";
import { DataColumnComponent } from "@alfresco/adf-core";
import { AppExtensionService } from "app/extensions/app-extension.service";

@Component({
  selector: "app-custom-btn",
  templateUrl: "./custom-btn.component.html",
  styleUrls: ["./custom-btn.component.scss"]
})
export class CustomBtnComponent implements OnInit {
  @Input() context: {
    data: ShareDataTableAdapter;
    row: ShareDataRow;
    col: DataColumnComponent;
    action: ActionRef;
  };
  action: ActionRef;
  disabled = false;
  constructor(private extensions: AppExtensionService) {}

  ngOnInit() {
    const { action } = this.context;
    this.action = action;
    if (this.action.rules && this.action.rules.enabled) {
      console.log(
        "TCL: CustomBtnComponent -> ngOnInit -> this.action.rules.enabled",
        this.action.rules.enabled
      );
      this.disabled = !this.extensions.checkRule(this.action.rules.enabled);
      console.log("TCL: CustomBtnComponent -> ngOnInit -> this.disabled", this.disabled);
    }
  }
  runAction() {
    if (this.action && this.action.click) {
      this.extensions.runActionById(this.action.click);
    }
  }
}
export interface ActionRef {
  click: string;
  title: string;
  rules: { enabled: string };
}
