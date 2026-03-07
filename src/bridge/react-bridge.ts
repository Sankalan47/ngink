import React from 'react';
import { Box, Text, Newline, Spacer, Static, Transform } from 'ink';
import Spinner from 'ink-spinner';
import { InkNode } from '../renderer/ink-node.js';

export function buildReactElement(node: InkNode): React.ReactNode {
  // Empty root renders nothing — React.createElement(Fragment, null) is valid
  if (node.type === 'root') {
    return React.createElement(React.Fragment, null, ...node.children.map(buildReactElement));
  }
  if (node.type === 'raw-text') return node.value ?? '';
  if (node.type === 'comment') return null;

  const children = node.children.map(buildReactElement);

  switch (node.type) {
    case 'text':
      return React.createElement(Text, node.props, ...children);
    case 'box':
      return React.createElement(Box, node.props, ...children);
    case 'spinner':
      // Spinner takes no children — only props (type prop controls the spinner style)
      return React.createElement(Spinner, node.props);
    case 'newline':
      return React.createElement(Newline, node.props);
    case 'spacer':
      return React.createElement(Spacer, node.props);
    case 'static':
      // Static requires items + children render fn — cast to any since props come from user template
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return React.createElement(Static as any, node.props, ...children);
    case 'transform':
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return React.createElement(Transform, node.props as any, ...children);
    default:
      return React.createElement(Box, node.props, ...children); // fallback for unknown elements
  }
}
