import React, { useEffect } from 'react';
import { useFocus, useFocusManager } from 'ink';

// ---- Focus Manager (singleton) ----
let enableFocusFn: (() => void) | null = null;
let disableFocusFn: (() => void) | null = null;
let focusNextFn: (() => void) | null = null;
let focusPreviousFn: (() => void) | null = null;
let focusFn: ((id: string) => void) | null = null;

export function enableFocus(): void   { enableFocusFn?.(); }
export function disableFocus(): void  { disableFocusFn?.(); }
export function focusNext(): void     { focusNextFn?.(); }
export function focusPrevious(): void { focusPreviousFn?.(); }
export function focusById(id: string): void { focusFn?.(id); }

export function FocusBridge(): null {
  const fm = useFocusManager();
  enableFocusFn   = fm.enableFocus;
  disableFocusFn  = fm.disableFocus;
  focusNextFn     = fm.focusNext;
  focusPreviousFn = fm.focusPrevious;
  focusFn         = fm.focus;
  return null;
}

// ---- Per-component focus wrapper ----
export type FocusableProps = {
  id?: string;
  isActive?: boolean;
  autoFocus?: boolean;
  onFocusChange?: (isFocused: boolean) => void;
  children?: React.ReactNode;
};

export function FocusableReact(props: FocusableProps): React.ReactElement {
  const { isFocused } = useFocus({
    id: props.id,
    isActive: props.isActive,
    autoFocus: props.autoFocus,
  });

  useEffect(() => {
    props.onFocusChange?.(isFocused);
  }, [isFocused]);

  return React.createElement(React.Fragment, null, props.children);
}
