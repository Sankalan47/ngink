import React from 'react';
import { useCursor } from 'ink';
import type { CursorPosition } from 'ink';

let setCursorPositionFn: ((position: CursorPosition | undefined) => void) | null = null;

export function setCursor(position: CursorPosition | undefined): void {
  setCursorPositionFn?.(position);
}

export function CursorBridge(): null {
  const { setCursorPosition } = useCursor();
  setCursorPositionFn = setCursorPosition;
  return null;
}
