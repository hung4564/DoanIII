import { ContentActionRef } from "@alfresco/adf-extensions";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  Input,
  ViewEncapsulation
} from "@angular/core";

@Component({
  selector: "app-toolbar-action",
  templateUrl: "./toolbar-action.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: "app-toolbar-action" }
})
export class ToolbarActionComponent implements DoCheck {
  @Input()
  type = "icon-button";

  @Input()
  color = "";

  @Input()
  actionRef: ContentActionRef;

  constructor(private cd: ChangeDetectorRef) {}

  ngDoCheck() {
    if (this.actionRef.id.includes("app.viewer")) {
      this.cd.markForCheck();
    }
  }
}
