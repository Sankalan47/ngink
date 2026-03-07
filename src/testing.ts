// @angular/common and @angular/platform-browser ship as partial-compilation (linker) artifacts.
// Their static initializers call ɵɵngDeclareFactory at module-load time, which requires the
// compiler facade to be present. A static import here ensures @angular/compiler is evaluated
// before those modules' static initializers run — a dynamic import() would be too late.
import '@angular/compiler';
import {
  type Type,
  RendererFactory2,
  provideZonelessChangeDetection,
  ɵsetDocument as setDocument,
  type ApplicationRef,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import React from 'react';
import { renderToString } from 'ink';
import { createNode } from './renderer/ink-node.js';
import { setRootNode, getRootNode, setRerenderFn, resetState } from './renderer/ink-renderer.js';
import { InkRendererFactory } from './renderer/ink-renderer.factory.js';
import { buildReactElement } from './bridge/react-bridge.js';

// Same mock document as bootstrap.ts — duplicated intentionally so testing.ts is independently usable.
const mockDocument = new Proxy({} as Document, {
  get(_target, prop) {
    if (prop === 'querySelectorAll' || prop === 'getElementsByTagName') return () => [];
    if (prop === 'querySelector' || prop === 'getElementById') return () => null;
    if (prop === 'addEventListener' || prop === 'removeEventListener') return () => {};
    if (prop === 'createElement') return () => ({});
    if (prop === 'readyState') return 'complete';
    return undefined;
  },
});

export type RenderCliOptions = {
  /** Terminal column width used when measuring line wrapping. Default: 80. */
  columns?: number;
};

/**
 * Headless render of an Angular CLI component to a plain string.
 * Intended for unit tests — does not open a real terminal.
 *
 * @example
 * const output = await renderCli(HelloComponent);
 * expect(output).toContain('Hello World');
 */
export async function renderCli(
  component: Type<any>,
  options: RenderCliOptions = {},
): Promise<string> {
  setDocument(mockDocument);
  setRootNode(createNode('root'));
  // renderToString is synchronous — no real rerender function needed.
  setRerenderFn(() => {});

  let appRef: ApplicationRef | null = null;
  try {
    appRef = await bootstrapApplication(component, {
      providers: [
        provideZonelessChangeDetection(),
        { provide: RendererFactory2, useClass: InkRendererFactory },
      ],
    });

    // Wait for a full macrotask turn so ALL pending microtasks (scheduleRerender's
    // queueMicrotask, Angular's change detection) are fully drained before we snapshot.
    await new Promise<void>((resolve) => setTimeout(resolve, 0));

    return renderToString(
      buildReactElement(getRootNode()) as React.ReactElement,
      { columns: options.columns ?? 80 },
    );
  } finally {
    appRef?.destroy();
    resetState();
  }
}
