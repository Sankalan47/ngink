import React from 'react';
import { Box, Text, Newline, Spacer, Static, Transform } from 'ink';
import Spinner from 'ink-spinner';
import { InkNode } from '../renderer/ink-node.js';
import { FocusableReact } from './focus-bridge.js';

const elementCache = new WeakMap<InkNode, { version: number; element: React.ReactNode }>();

export function buildReactElement(node: InkNode): React.ReactNode {
  const hit = elementCache.get(node);
  if (hit && hit.version === node.version) return hit.element;

  let element: React.ReactNode;

  // Empty root renders nothing — React.createElement(Fragment, null) is valid
  if (node.type === 'root') {
    element = React.createElement(React.Fragment, null, ...node.children.map(buildReactElement));
  } else if (node.type === 'raw-text') {
    element = node.value ?? '';
  } else if (node.type === 'comment') {
    element = null;
  } else {
    const children = node.children.map(buildReactElement);

    switch (node.type) {
      case 'text':
        element = React.createElement(Text, node.props, ...children);
        break;
      case 'box':
        element = React.createElement(Box, node.props, ...children);
        break;
      case 'spinner':
        // Spinner takes no children — only props (type prop controls the spinner style)
        element = React.createElement(Spinner, node.props);
        break;
      case 'newline':
        element = React.createElement(Newline, node.props);
        break;
      case 'spacer':
        element = React.createElement(Spacer, node.props);
        break;
      case 'static':
        // Static requires items + children render fn — cast to any since props come from user template
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        element = React.createElement(Static as any, node.props, ...children);
        break;
      case 'transform':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        element = React.createElement(Transform, node.props as any, ...children);
        break;
      case 'focusable':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        element = React.createElement(FocusableReact, node.props as any, ...children);
        break;
      default:
        element = React.createElement(Box, node.props, ...children); // fallback for unknown elements
    }
  }

  elementCache.set(node, { version: node.version, element });
  return element;
}
