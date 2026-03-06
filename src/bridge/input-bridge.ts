import React from 'react';
import { useInput, useApp, useStdin } from 'ink';
import type { Key } from 'ink';

export type KeyHandler = (input: string, key: Key) => void;

let keyHandler: KeyHandler | null = null;
let exitFn: (() => void) | null = null;

export function setKeyHandler(handler: KeyHandler): void {
  keyHandler = handler;
}

export function exitApp(): void {
  exitFn?.();
}

export function InputBridge(): null {
  const { exit } = useApp();
  const { isRawModeSupported } = useStdin();
  exitFn = exit;

  useInput(
    (input, key) => {
      if (key.ctrl && input === 'c') {
        exit();
        return;
      }
      keyHandler?.(input, key);
    },
    { isActive: isRawModeSupported },
  );

  return null;
}
