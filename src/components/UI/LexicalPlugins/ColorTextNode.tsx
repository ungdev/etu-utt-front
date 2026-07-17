import {
  $getState,
  $setState,
  BaseStaticNodeConfig,
  createState,
  EditorConfig,
  NodeKey,
  SerializedTextNode,
  Spread,
  TextNode,
} from 'lexical';
import styles from '../LexicalTextEditor.module.scss';

const ColorOptions = ['blue', 'darkblue', 'grey', 'darkgrey'] as const;
export type ColorType = (typeof ColorOptions)[number];

type SerializedColorTextNode = Spread<{ color?: ColorType }, SerializedTextNode>;

const colorState = createState('color', {
  parse: (v) => (ColorOptions.includes(v as ColorType) ? (v as ColorType) : undefined),
});

export class ColorTextNode extends TextNode {
  $config(): BaseStaticNodeConfig {
    return this.config('color-text', {
      extends: TextNode,
      stateConfigs: [{ flat: true, stateConfig: colorState }],
    });
  }

  setColor(color?: ColorType) {
    $setState(this, colorState, color);
    return this;
  }

  createDOM(config: EditorConfig) {
    const dom = super.createDOM(config);
    if ($getState(this, colorState)) dom.classList.toggle(styles[`color-text-${$getState(this, colorState)}`], true);
    return dom;
  }

  updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig) {
    const updated = super.updateDOM(prevNode, dom, config);
    if ($getState(prevNode, colorState) !== $getState(this, colorState))
      dom.classList.toggle(styles[`color-text-${$getState(prevNode, colorState)}`], false);
    if ($getState(this, colorState)) dom.classList.toggle(styles[`color-text-${$getState(this, colorState)}`], true);
    return updated;
  }

  static importJSON(serializedNode: SerializedColorTextNode): ColorTextNode {
    return $createColorTextNode(serializedNode.text).updateFromJSON(serializedNode).setColor(serializedNode.color);
  }

  exportJSON(): SerializedColorTextNode {
    return {
      ...super.exportJSON(),
      color: $getState(this, colorState),
      $: undefined,
    };
  }

  isSimpleText(): boolean {
    return this.__type === 'color-text' && this.__mode === 0;
  }
}

export function $createColorTextNode(text?: string, nodeKey?: NodeKey): ColorTextNode {
  return new ColorTextNode(text, nodeKey);
}

export function $createColorTextNodeFromTextNode(textNode: TextNode, color?: ColorType): ColorTextNode {
  return $createColorTextNode(textNode.getTextContent()).updateFromJSON(textNode.exportJSON()).setColor(color);
}

export function $isColorTextNode(node: unknown): node is ColorTextNode {
  return node instanceof ColorTextNode;
}
