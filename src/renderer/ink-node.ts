export type InkNodeType =
  | 'root'
  | 'box'
  | 'text'
  | 'spinner'
  | 'newline'
  | 'spacer'
  | 'static'
  | 'transform'
  | 'focusable'
  | 'raw-text'
  | 'comment';

export interface InkNode {
  type: InkNodeType;
  props: Record<string, any>;
  children: InkNode[];
  value?: string;
  parent?: InkNode;
}

export function createNode(type: InkNodeType): InkNode {
  return { type, props: {}, children: [] };
}
