import { createState, EditorConfig, LexicalNode, NodeKey, SerializedTextNode, Spread, TextNode } from 'lexical';
import styles from '../LexicalTextEditor.module.scss';

export type ColorType = 'blue' | 'darkblue' | 'grey' | 'darkgrey';

type SerializedColorTextNode = Spread<{ color?: ColorType }, SerializedTextNode>;

export class ColorTextNode extends TextNode {
  __color?: ColorType;

  static getType() {
    return 'color-text';
  }

  static clone(node: ColorTextNode) {
    return new ColorTextNode(node.__text, node.__color, node.__key);
  }

  constructor(text?: string, color?: ColorType, key?: NodeKey) {
    super(text, key);
    this.__color = color;
  }

  setColor(color?: ColorType) {
    const self = this.getWritable();
    self.__color = color;
    return this;
  }

  splitText(...splitOffsets: Array<number>): Array<ColorTextNode> {
    return super.splitText(...splitOffsets).map((node) => (node as ColorTextNode).setColor(this.__color));
  }

  createDOM(config: EditorConfig) {
    const dom = super.createDOM(config);
    if (this.__color) dom.classList.toggle(styles[`color-text-${this.__color}`], true);
    return dom;
  }

  updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig) {
    const updated = super.updateDOM(prevNode, dom, config);
    if (prevNode.__color !== this.__color) dom.classList.toggle(styles[`color-text-${prevNode.__color}`], false);
    if (this.__color) dom.classList.toggle(styles[`color-text-${this.__color}`], true);
    return updated;
  }

  static importJSON(serializedNode: SerializedColorTextNode): ColorTextNode {
    return $createColorTextNode(serializedNode.text, serializedNode.color).updateFromJSON(serializedNode);
  }

  exportJSON(): SerializedColorTextNode {
    return {
      ...super.exportJSON(),
      color: this.__color,
    };
  }

  isSimpleText(): boolean {
    return this.__type === 'color-text' && !this.__color && this.__mode === 0;
  }

  mayMerge(node: LexicalNode): boolean {
    return (
      $isColorTextNode(node) &&
      node.__color === this.__color &&
      node.__format === this.__format &&
      !this.isUnmergeable() &&
      !node.isUnmergeable()
    );
  }
}

export function $createColorTextNode(text?: string, color?: ColorType, nodeKey?: NodeKey): ColorTextNode {
  return new ColorTextNode(text, color, nodeKey);
}

export function $createColorTextNodeFromTextNode(textNode: TextNode, color?: ColorType): ColorTextNode {
  return $createColorTextNode(textNode.getTextContent(), color).updateFromJSON(textNode.exportJSON());
}

export function $isColorTextNode(node: unknown): node is ColorTextNode {
  return node instanceof ColorTextNode;
}
