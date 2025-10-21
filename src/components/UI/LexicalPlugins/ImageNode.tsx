import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { DecoratorNode, EditorConfig, NodeKey, SerializedLexicalNode, Spread } from 'lexical';
import { ImageMedia } from '../ImageMedia';
import styles from '../LexicalTextEditor.module.scss';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { JSX } from 'react';

type SerializedImageNode = Spread<
  {
    key: NodeKey;
    src: string;
    altText: string;
    width: number | 'inherit';
    height: number | 'inherit';
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __width: number | 'inherit';
  __height: number | 'inherit';

  static getType() {
    return 'image';
  }

  static clone(node: ImageNode) {
    return new ImageNode(node.__src, node.__altText, node.__width, node.__height, node.__key);
  }

  constructor(src: string, altText?: string, width?: number | 'inherit', height?: number | 'inherit', key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__altText = altText || '';
    this.__width = width || 'inherit';
    this.__height = height || 'inherit';
  }

  createDOM(config: EditorConfig) {
    const span = document.createElement('span');
    if (config?.theme?.image) span.className = config.theme.image;
    return span;
  }

  decorate() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const image = this;
    function ImageComponent() {
      const [editor] = useLexicalComposerContext();
      const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(image.getKey());
      return (
        <ImageMedia
          className={isSelected && editor._editable ? styles.selected : ''}
          src={image.__src}
          width={image.__width}
          height={image.__height}
          altText={image.__altText}
          onClick={(event) => {
            if (!editor._editable) {
              setSelected(false);
              clearSelection();
            } else if (event.shiftKey) {
              setSelected(!isSelected);
            } else {
              clearSelection();
              setSelected(true);
            }
            event.preventDefault();
            event.stopPropagation();
            return true;
          }}
        />
      );
    }
    return <ImageComponent />;
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return $createImageNode(
      serializedNode.src,
      serializedNode.altText,
      serializedNode.width,
      serializedNode.height,
    ).updateFromJSON(serializedNode);
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      key: this.__key,
      src: this.__src,
      altText: this.__altText,
      width: this.__width,
      height: this.__height,
    };
  }
}

export function $createImageNode(
  src: string,
  altText?: string,
  width?: number | 'inherit',
  height?: number | 'inherit',
  nodeKey?: NodeKey,
): ImageNode {
  return new ImageNode(src, altText, width, height, nodeKey);
}

export function $isImageNode(node: unknown): node is ImageNode {
  return node instanceof ImageNode;
}
