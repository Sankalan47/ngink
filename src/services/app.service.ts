import { Injectable } from '@angular/core';
import { exitApp } from '../bridge/input-bridge.js';

@Injectable({ providedIn: 'root' })
export class AppService {
  /** Exit the Ink app cleanly (equivalent to Ctrl+C). */
  exit(): void {
    exitApp();
  }
}
