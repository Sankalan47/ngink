import { Injectable } from '@angular/core';
import { setCursor } from '../bridge/cursor-bridge.js';
import type { CursorPosition } from 'ink';

@Injectable({ providedIn: 'root' })
export class CursorService {
  setCursorPosition(position: CursorPosition | undefined): void {
    setCursor(position);
  }

  hideCursor(): void {
    setCursor(undefined);
  }

  showCursor(x: number, y: number): void {
    setCursor({ x, y });
  }
}
