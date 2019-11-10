import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  Output,
  EventEmitter
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface VersionFormEntry {
  comment: string;
  version: boolean;
}

@Component({
  selector: 'app-node-version-form',
  templateUrl: './node-version-form.component.html',
  styleUrls: ['./node-version-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'app-node-version-form__container' },
  exportAs: 'nodeVersionForm'
})
export class AppNodeVersionFormComponent implements OnInit, OnDestroy {
  @Output() update: EventEmitter<VersionFormEntry> = new EventEmitter();

  form: FormGroup;

  private onDestroy$: Subject<boolean> = new Subject<boolean>();
  private versionOptions = [
    { label: 'VERSION.FORM.VERSION.MINOR', value: false },
    { label: 'VERSION.FORM.VERSION.MAJOR', value: true }
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      comment: [''],
      version: [this.versionOptions[0].value]
    });

    this.form.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((values: VersionFormEntry) => {
        this.update.emit(values);
      });
  }

  get versions() {
    return this.versionOptions;
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
