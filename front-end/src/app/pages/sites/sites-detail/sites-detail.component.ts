import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SitesService } from '../sites.service';
import { FormGroup } from '@angular/forms';
import { Site } from '@alfresco/js-api';
@Component({
  selector: 'app-sites-detail',
  templateUrl: './sites-detail.component.html',
  styleUrls: ['./sites-detail.component.scss']
})
export class SitesDetailComponent implements OnInit {
  siteForm: FormGroup;
  title: string;
  roles = Site.RoleEnum;
  visibilities = Site.VisibilityEnum;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _sitesSv: SitesService,
    public dialogRef: MatDialogRef<SitesDetailComponent>
  ) {
    this.title = data.title;
    this.siteForm = this._sitesSv.createForm(data);
  }

  ngOnInit() {}
  revert() {
    this.siteForm.reset();
  }
  hasError(controlName: string, errorName: string) {
    return this.siteForm.controls[controlName].hasError(errorName);
  }
  onSubmit() {
    this.dialogRef.close(this.siteForm.value);
  }
}
