import { Injectable } from '@angular/core';
import { enableFocus, disableFocus, focusNext, focusPrevious, focusById } from '../bridge/focus-bridge.js';

@Injectable({ providedIn: 'root' })
export class FocusService {
  enableFocus(): void            { enableFocus(); }
  disableFocus(): void           { disableFocus(); }
  focusNext(): void              { focusNext(); }
  focusPrevious(): void          { focusPrevious(); }
  focus(id: string): void        { focusById(id); }
}
