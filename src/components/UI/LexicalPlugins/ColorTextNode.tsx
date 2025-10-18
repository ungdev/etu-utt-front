import {
  $getEditor,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isTextNode,
  $setCompositionKey,
  EditorConfig,
  LexicalNode,
  NodeKey,
  RangeSelection,
  SerializedTextNode,
  Spread,
  TextNode,
} from 'lexical';
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
  }

  /**
   * Comes from the method of base class TextNode. If this is not overwritten,
   * the base class uses $createTextNode directly to split text, losing the benefits of this custom class
   * @see TextNode.splitText
   */
  splitText(...splitOffsets: Array<number>): Array<ColorTextNode> {
    super.splitText(...splitOffsets); // Keep this to fail on read-only
    const self = this.getLatest();
    const textContent = self.getTextContent();
    if (textContent === '') {
      return [];
    }
    const key = self.__key;
    const compositionKey = $getEditor()._compositionKey;
    const textLength = textContent.length;
    splitOffsets.sort((a, b) => a - b);
    splitOffsets.push(textLength);
    const parts = [];
    const splitOffsetsLength = splitOffsets.length;
    for (let start = 0, offsetIndex = 0; start < textLength && offsetIndex <= splitOffsetsLength; offsetIndex++) {
      const end = splitOffsets[offsetIndex];
      if (end > start) {
        parts.push(textContent.slice(start, end));
        start = end;
      }
    }
    const partsLength = parts.length;
    if (partsLength === 1) {
      return [self];
    }
    const firstPart = parts[0];
    const parent = self.getParent();
    let writableNode;
    const format = self.getFormat();
    const style = self.getStyle();
    const detail = self.__detail;
    let hasReplacedSelf = false;

    // Prepare to handle selection
    const selection = $getSelection();
    let endTextPoint: RangeSelection['anchor'] | null = null;
    let startTextPoint: RangeSelection['anchor'] | null = null;
    if ($isRangeSelection(selection)) {
      const [startPoint, endPoint] = selection.isBackward()
        ? [selection.focus, selection.anchor]
        : [selection.anchor, selection.focus];
      if (startPoint.type === 'text' && startPoint.key === key) {
        startTextPoint = startPoint;
      }
      if (endPoint.type === 'text' && endPoint.key === key) {
        endTextPoint = endPoint;
      }
    }

    if (self.isSegmented()) {
      // Create a new TextNode
      writableNode = $createColorTextNode(firstPart, this.__color);
      writableNode.__format = format;
      writableNode.__style = style;
      writableNode.__detail = detail;
      writableNode.__state = $cloneNodeState(self, writableNode);
      hasReplacedSelf = true;
    } else {
      // For the first part, update the existing node
      writableNode = self.setTextContent(firstPart);
    }

    // Then handle all other parts
    const splitNodes: ColorTextNode[] = [writableNode];
    let textSize = firstPart.length;

    for (let i = 1; i < partsLength; i++) {
      const part = parts[i];
      const partSize = part.length;
      const sibling = $createColorTextNode(part, this.__color);
      sibling.__format = format;
      sibling.__style = style;
      sibling.__detail = detail;
      sibling.__state = $cloneNodeState(self, sibling);
      const siblingKey = sibling.__key;
      const nextTextSize = textSize + partSize;
      if (compositionKey === key) {
        $setCompositionKey(siblingKey);
      }
      textSize = nextTextSize;
      splitNodes.push(sibling);
    }

    // Move the selection to the best location in the split string.
    // The end point is always left-biased, and the start point is
    // generally left biased unless the end point would land on a
    // later node in the split in which case it will prefer the start
    // of that node so they will tend to be on the same node.
    const originalStartOffset = startTextPoint ? startTextPoint.offset : null;
    const originalEndOffset = endTextPoint ? endTextPoint.offset : null;
    let startOffset = 0;
    for (const node of splitNodes) {
      if (!(startTextPoint || endTextPoint)) {
        break;
      }
      const endOffset = startOffset + node.getTextContentSize();
      if (
        startTextPoint !== null &&
        originalStartOffset !== null &&
        originalStartOffset <= endOffset &&
        originalStartOffset >= startOffset
      ) {
        // Set the start point to the first valid node
        startTextPoint.set(node.getKey(), originalStartOffset - startOffset, 'text');
        if (originalStartOffset < endOffset) {
          // The start isn't on a border so we can stop checking
          startTextPoint = null;
        }
      }
      if (
        endTextPoint !== null &&
        originalEndOffset !== null &&
        originalEndOffset <= endOffset &&
        originalEndOffset >= startOffset
      ) {
        endTextPoint.set(node.getKey(), originalEndOffset - startOffset, 'text');
        break;
      }
      startOffset = endOffset;
    }

    // Insert the nodes into the parent's children
    if (parent !== null) {
      this.getNextSibling()?.markDirty();
      this.getPreviousSibling()?.markDirty();
      const writableParent = parent.getWritable();
      const insertionIndex = this.getIndexWithinParent();
      if (hasReplacedSelf) {
        writableParent.splice(insertionIndex, 0, splitNodes);
        this.remove();
      } else {
        writableParent.splice(insertionIndex, 1, splitNodes);
      }

      if ($isRangeSelection(selection)) {
        $updateElementSelectionOnCreateDeleteNode(selection, parent, insertionIndex, partsLength - 1);
      }
    }

    return splitNodes;
  }

  createDOM(config: EditorConfig) {
    const dom = super.createDOM(config);
    dom.classList.toggle(styles[`color-text-${this.__color}`], true);
    return dom;
  }

  updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig) {
    const updated = super.updateDOM(prevNode, dom, config);
    if (prevNode.__color !== this.__color) dom.classList.toggle(styles[`color-text-${prevNode.__color}`], false);
    dom.classList.toggle(styles[`color-text-${this.__color}`], true);
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
}

export function $createColorTextNode(text?: string, color?: ColorType, nodeKey?: NodeKey): ColorTextNode {
  return new ColorTextNode(text, color, nodeKey);
}

export function $isColorTextNode(node: unknown): node is ColorTextNode {
  return node instanceof ColorTextNode;
}

/** Comes from non exported function from lexical */
export function $cloneNodeState<T extends LexicalNode>(from: T, to: T): undefined | T['__state'] {
  const state = from.__state;
  return state && state.node === from ? state.getWritable(to) : state;
}

/** Comes from non exported function from lexical : https://github.com/facebook/lexical/blob/main/packages/lexical/src/LexicalSelection.ts */
export function $updateElementSelectionOnCreateDeleteNode(
  selection: RangeSelection,
  parentNode: LexicalNode,
  nodeOffset: number,
  times = 1,
): void {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = anchor.getNode();
  const focusNode = focus.getNode();
  if (!parentNode.is(anchorNode) && !parentNode.is(focusNode)) {
    return;
  }
  const parentKey = parentNode.__key;
  // Single node. We shift selection but never redimension it
  if (selection.isCollapsed()) {
    const selectionOffset = anchor.offset;
    if ((nodeOffset <= selectionOffset && times > 0) || (nodeOffset < selectionOffset && times < 0)) {
      const newSelectionOffset = Math.max(0, selectionOffset + times);
      anchor.set(parentKey, newSelectionOffset, 'element');
      focus.set(parentKey, newSelectionOffset, 'element');
      // The new selection might point to text nodes, try to resolve them
      $updateSelectionResolveTextNodes(selection);
    }
  } else {
    // Multiple nodes selected. We shift or redimension selection
    const isBackward = selection.isBackward();
    const firstPoint = isBackward ? focus : anchor;
    const firstPointNode = firstPoint.getNode();
    const lastPoint = isBackward ? anchor : focus;
    const lastPointNode = lastPoint.getNode();
    if (parentNode.is(firstPointNode)) {
      const firstPointOffset = firstPoint.offset;
      if ((nodeOffset <= firstPointOffset && times > 0) || (nodeOffset < firstPointOffset && times < 0)) {
        firstPoint.set(parentKey, Math.max(0, firstPointOffset + times), 'element');
      }
    }
    if (parentNode.is(lastPointNode)) {
      const lastPointOffset = lastPoint.offset;
      if ((nodeOffset <= lastPointOffset && times > 0) || (nodeOffset < lastPointOffset && times < 0)) {
        lastPoint.set(parentKey, Math.max(0, lastPointOffset + times), 'element');
      }
    }
  }
  // The new selection might point to text nodes, try to resolve them
  $updateSelectionResolveTextNodes(selection);
}

/** Comes from non exported function from lexical : https://github.com/facebook/lexical/blob/main/packages/lexical/src/LexicalSelection.ts */
function $updateSelectionResolveTextNodes(selection: RangeSelection): void {
  const anchor = selection.anchor;
  const anchorOffset = anchor.offset;
  const focus = selection.focus;
  const focusOffset = focus.offset;
  const anchorNode = anchor.getNode();
  const focusNode = focus.getNode();
  if (selection.isCollapsed()) {
    if (!$isElementNode(anchorNode)) {
      return;
    }
    const childSize = anchorNode.getChildrenSize();
    const anchorOffsetAtEnd = anchorOffset >= childSize;
    const child = anchorOffsetAtEnd
      ? anchorNode.getChildAtIndex(childSize - 1)
      : anchorNode.getChildAtIndex(anchorOffset);
    if ($isTextNode(child)) {
      let newOffset = 0;
      if (anchorOffsetAtEnd) {
        newOffset = child.getTextContentSize();
      }
      anchor.set(child.__key, newOffset, 'text');
      focus.set(child.__key, newOffset, 'text');
    }
    return;
  }
  if ($isElementNode(anchorNode)) {
    const childSize = anchorNode.getChildrenSize();
    const anchorOffsetAtEnd = anchorOffset >= childSize;
    const child = anchorOffsetAtEnd
      ? anchorNode.getChildAtIndex(childSize - 1)
      : anchorNode.getChildAtIndex(anchorOffset);
    if ($isTextNode(child)) {
      let newOffset = 0;
      if (anchorOffsetAtEnd) {
        newOffset = child.getTextContentSize();
      }
      anchor.set(child.__key, newOffset, 'text');
    }
  }
  if ($isElementNode(focusNode)) {
    const childSize = focusNode.getChildrenSize();
    const focusOffsetAtEnd = focusOffset >= childSize;
    const child = focusOffsetAtEnd ? focusNode.getChildAtIndex(childSize - 1) : focusNode.getChildAtIndex(focusOffset);
    if ($isTextNode(child)) {
      let newOffset = 0;
      if (focusOffsetAtEnd) {
        newOffset = child.getTextContentSize();
      }
      focus.set(child.__key, newOffset, 'text');
    }
  }
}
