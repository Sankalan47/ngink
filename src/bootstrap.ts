import {
  Type,
  RendererFactory2,
  provideZonelessChangeDetection,
  ɵsetDocument as setDocument,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import React from 'react';
import { render } from 'ink';
import { createNode } from './renderer/ink-node.js';
import { setRootNode, setRerenderFn } from './renderer/ink-renderer.js';
import { InkRendererFactory } from './renderer/ink-renderer.factory.js';
import { buildReactElement } from './bridge/react-bridge.js';

// Minimal mock document for Node.js — Angular's image perf warning and other initializers need it
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

export async function bootstrapCli(component: Type<any>): Promise<void> {
  // Provide a mock document so Angular's internal initializers don't throw in Node.js
  setDocument(mockDocument);

  // Initialize root node
  const rootNode = createNode('root');
  setRootNode(rootNode);

  // 1. Start Ink first — takes over stdout, renders empty tree initially
  const inkInstance = render(buildReactElement(rootNode) as React.ReactElement);
  setRerenderFn(inkInstance.rerender);

  // 2. Bootstrap Angular — JIT compiles template, InkRenderer builds the node tree, scheduleRerender fires
  //    bootstrapApplication handles zone/zoneless setup correctly; our RendererFactory2 overrides the DOM renderer
  await bootstrapApplication(component, {
    providers: [
      provideZonelessChangeDetection(),
      { provide: RendererFactory2, useClass: InkRendererFactory },
    ],
  });
}
