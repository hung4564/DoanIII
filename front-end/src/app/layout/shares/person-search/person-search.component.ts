import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { debounceTime, tap, switchMap, finalize, takeUntil } from "rxjs/operators";
import { HandleService, Webscript } from "app/services/api.service";
import { Observable, Subject } from "rxjs";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: "person-search",
  templateUrl: "./person-search.component.html",
  styleUrls: ["./person-search.component.scss"]
})
export class PersonSearchComponent implements OnInit {
  searchPersonsCtrl = new FormControl("", [Validators.min(2)]);
  filteredPersons: any[] = [];
  isLoading = false;
  errorMsg: string;
  personSelect: any;
  @Input() placeholder: string;
  @Output("selectPerson") change = new EventEmitter<boolean>();
  onDestroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    private handleSV: HandleService,
    public dialogRef: MatDialogRef<PersonSearchComponent>
  ) {}
  searchUser(query) {
    this.change.emit();
    return new Observable(observable => {
      const webScript: Webscript = {
        httpMethod: "GET",
        scriptPath: "/queries/people",
        scriptArgs: { term: query },
        contextRoot: null,
        servicePath: "api/-default-/public/alfresco/versions/1",
        postBody: null
      };
      this.handleSV.handleApi(webScript).then(
        result => {
          observable.next({ data: result });
          observable.complete();
        },
        err => {
          observable.next({ error: err });
          observable.complete();
        }
      );
    });
  }
  ngOnInit() {
    this.searchPersonsCtrl.valueChanges
      .pipe(
        debounceTime(500),
        tap(() => {
          this.errorMsg = "";
          this.filteredPersons = [];
          this.isLoading = true;
        }),
        switchMap(value =>
          this.searchUser(value).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        ),
        takeUntil(this.onDestroy$)
      )
      .subscribe((result: any) => {
        if (result.data) {
          const data = result.data;
          this.errorMsg = "";
          this.filteredPersons = data.list.entries.map(x => x.entry);
        } else {
        }
      });
  }
  selectPerson(person) {
    if (person) {
      this.change.emit(person);
      this.personSelect = person;
    }
  }
  submit() {
    this.dialogRef.close(this.personSelect);
  }
  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
