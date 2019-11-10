import { InjectionToken } from '@angular/core';

export const CONTEXT_MENU_DIRECTION = new InjectionToken(
  'CONTEXT_MENU_DIRECTION',
  {
    providedIn: 'root',
    factory: () => 'ltr'
  }
);
