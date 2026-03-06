import { Injectable, signal } from '@angular/core';
import { setKeyHandler } from '../bridge/input-bridge.js';
import type { Key } from 'ink';

export interface KeyPress {
  input: string;
  key: Key;
}

@Injectable({ providedIn: 'root' })
export class InputService {
  readonly key = signal<string>('');
  readonly isCtrl = signal<boolean>(false);
  readonly isShift = signal<boolean>(false);
  /** New object each press — always triggers effects that depend on it */
  readonly keypress = signal<KeyPress | null>(null);

  constructor() {
    setKeyHandler((input, key) => {
      this.key.set(input);
      this.isCtrl.set(key.ctrl ?? false);
      this.isShift.set(key.shift ?? false);
      this.keypress.set({ input, key });
    });
  }
}
