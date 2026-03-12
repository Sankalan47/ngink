import { Renderer2 } from '@angular/core';
import React from 'react';
import { createNode, InkNode, InkNodeType } from './ink-node.js';
import { buildReactElement } from '../bridge/react-bridge.js';

// Module-level singletons — shared across all renderer instances
let rootNode: InkNode = createNode('root');
let rerenderFn: ((el: React.ReactElement) => void) | null = null;
let pending = false;

export function setRootNode(node: InkNode): void {
  rootNode = node;
}

export function getRootNode(): InkNode {
  return rootNode;
}

export function setRerenderFn(fn: (el: React.ReactElement) => void): void {
  rerenderFn = fn;
}

export function resetState(): void {
  rootNode = createNode('root');
  rerenderFn = null;
  pending = false;
}

export function scheduleRerender(): void {
  if (pending) return;
  pending = true;
  queueMicrotask(() => {
    pending = false;
    rerenderFn?.(buildReactElement(rootNode) as React.ReactElement);
  });
}

function markDirty(node: InkNode): void {
  let n: InkNode | undefined = node;
  while (n) {
    n.version++;
    n = n.parent;
  }
  scheduleRerender();
}

// Debug helper — use console.error (Ink owns stdout)
export function debugNodeTree(node: InkNode, depth = 0): void {
  console.error(
    ' '.repeat(depth * 2) + node.type,
    node.value ?? '',
    JSON.stringify(node.props),
  );
  node.children.forEach((c) => debugNodeTree(c, depth + 1));
}

export class InkRenderer implements Renderer2 {
  destroyNode: ((node: any) => void) | null = null;
  data: { [key: string]: any } = {};

  destroy(): void {}

  createElement(name: string, _namespace?: string | null): InkNode {
    return createNode(name.toLowerCase() as InkNodeType);
  }

  createComment(_value: string): InkNode {
    return createNode('comment');
  }

  createText(value: string): InkNode {
    const node = createNode('raw-text');
    node.value = value;
    return node;
  }

  appendChild(parent: InkNode, newChild: InkNode): void {
    newChild.parent = parent;
    parent.children.push(newChild);
    markDirty(parent);
  }

  insertBefore(parent: InkNode, newChild: InkNode, refChild: InkNode, _isMove?: boolean): void {
    newChild.parent = parent;
    const idx = parent.children.indexOf(refChild);
    if (idx === -1) {
      parent.children.push(newChild);
    } else {
      parent.children.splice(idx, 0, newChild);
    }
    markDirty(parent);
  }

  removeChild(parent: InkNode | null, oldChild: InkNode, _isHostElement?: boolean): void {
    // Angular 21's nativeRemoveNode always passes null as parent.
    // Fall back to the node's tracked parent reference.
    const actualParent = parent ?? oldChild.parent;
    if (!actualParent) return;
    const idx = actualParent.children.indexOf(oldChild);
    if (idx !== -1) {
      actualParent.children.splice(idx, 1);
    }
    oldChild.parent = undefined;
    markDirty(actualParent);
  }

  selectRootElement(_selectorOrNode: any, _preserveContent?: boolean): InkNode {
    // Angular passes the component selector string here — we always return the global root
    return rootNode;
  }

  parentNode(node: InkNode): InkNode | null {
    return node.parent ?? null;
  }

  nextSibling(node: InkNode): InkNode | null {
    const parent = node.parent;
    if (!parent) return null;
    const idx = parent.children.indexOf(node);
    return parent.children[idx + 1] ?? null;
  }

  setAttribute(el: InkNode, name: string, value: string, _namespace?: string | null): void {
    if (el.props[name] === value) return;
    el.props[name] = value;
    markDirty(el);
  }

  removeAttribute(el: InkNode, name: string, _namespace?: string | null): void {
    if (!(name in el.props)) return;
    delete el.props[name];
    markDirty(el);
  }

  setProperty(el: InkNode, name: string, value: any): void {
    if (el.props[name] === value) return;
    el.props[name] = value;
    markDirty(el);
  }

  setValue(node: InkNode, value: string): void {
    if (node.value === value) return;
    node.value = value;
    markDirty(node);
  }

  listen(_target: any, _eventName: string, _callback: (event: any) => boolean | void): () => void {
    return () => {}; // No-op — terminal has no DOM events; keyboard/focus/resize are bridged via React hooks
  }

  // No-ops — no CSS in terminal
  addClass(_el: any, _name: string): void {}
  removeClass(_el: any, _name: string): void {}
  setStyle(_el: any, _style: string, _value: any, _flags?: any): void {}
  removeStyle(_el: any, _style: string, _flags?: any): void {}
}
