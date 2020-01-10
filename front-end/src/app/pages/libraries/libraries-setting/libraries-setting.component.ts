import { Site } from "@alfresco/js-api";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { ContentManagementService } from "app/services/content-management.service";
import { SetCurrentLibraryAction } from "app/store/actions/app.actions";
import {
  AddApproveFolderAction,
  DeleteApproveFolderAction,
  UpdateLibraryAction
} from "app/store/actions/library.actions";
import { LibraryService } from "../library.service";

@Component({
  selector: "app-libraries-setting",
  templateUrl: "./libraries-setting.component.html",
  styleUrls: ["./libraries-setting.component.scss"]
})
export class LibrariesSettingComponent implements OnInit {
  siteForm: FormGroup;
  title: string;
  roles = Site.RoleEnum;
  visibilities = Site.VisibilityEnum;
  isApprove: boolean;
  site: Site;
  constructor(
    private libraySv: LibraryService,
    private store: Store<any>,
    private content: ContentManagementService
  ) {}

  ngOnInit() {
    this.libraySv.getSite().subscribe(site => {
      this.site = site.entry;
      this.isApprove = site.entry.isApprove;
      this.siteForm = this.createForm(site.entry);
    });
    this.content.libraryUpdated.subscribe(site => {
      this.store.dispatch(new SetCurrentLibraryAction(site.entry));
    });
  }
  createForm(data: Site): FormGroup {
    if (!data.id) {
      data.visibility = Site.VisibilityEnum.PRIVATE;
    }
    const isApprove = this.isApprove;
    return new FormGroup({
      title: new FormControl(data.title, [Validators.required]),
      description: new FormControl(data.description),
      visibility: new FormControl(data.visibility, [Validators.required]),
      isApprove: new FormControl(isApprove, [])
    });
  }
  revert() {
    this.siteForm.reset();
  }
  hasError(controlName: string, errorName: string) {
    return this.siteForm.controls[controlName].hasError(errorName);
  }
  onSubmit(data) {
    let isUpdate = false;
    Object.keys(data).forEach(key => {
      if (this.site[key] !== data[key] && data[key]) {
        isUpdate = true;
      }
    });
    if (isUpdate) {
      this.store.dispatch(
        new UpdateLibraryAction({ ...data, id: this.site.id })
      );
    }
    if (data.isApprove && !this.isApprove) {
      this.store.dispatch(new AddApproveFolderAction(this.site));
    }
    if (!data.isApprove && this.isApprove) {
      this.libraySv.getSite().subscribe(site => {
        this.store.dispatch(
          new DeleteApproveFolderAction(
            this.libraySv.getApproveFolder(
              site.relations.containers.list.entries
            ).entry.id
          )
        );
      });
    }
  }
}
