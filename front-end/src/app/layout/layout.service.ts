import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private _toggleSide$: Subject<boolean> = new Subject<boolean>();
  get toggleSide$() {
    return this._toggleSide$;
  }
  constructor() {}
  toggleSide(value) {
    this._toggleSide$.next(value);
  }
}
