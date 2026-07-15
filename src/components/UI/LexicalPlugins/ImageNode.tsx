import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import {
  $getState,
  $setState,
  BaseStaticNodeConfig,
  createState,
  DecoratorNode,
  EditorConfig,
  NodeKey,
  SerializedLexicalNode,
  Spread
} from "lexical";
import { ImageMedia } from '../ImageMedia';
import styles from '../LexicalTextEditor.module.scss';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

type SerializedImageNode = Spread<
  {
    src: string;
    altText: string;
    width: number | 'inherit';
    height: number | 'inherit';
  },
  SerializedLexicalNode
>;

export const srcState = createState('src', {
  parse: (value) => (typeof value === 'string' ? value : ''),
});

export const altTextState = createState('altText', {
  parse: (value) => (typeof value === 'string' ? value : ''),
});

export const widthState = createState('width', {
  parse: (value) => (value === 'inherit' || typeof value === 'number' ? value : 'inherit'),
});

export const heightState = createState('height', {
  parse: (value) => (value === 'inherit' || typeof value === 'number' ? value : 'inherit'),
});

export class ImageNode extends DecoratorNode<JSX.Element> {
  $config(): BaseStaticNodeConfig {
    return this.config('image', {
      extends: DecoratorNode,
      stateConfigs: [
        { flat: true, stateConfig: srcState },
        { flat: true, stateConfig: altTextState },
        { flat: true, stateConfig: widthState },
        { flat: true, stateConfig: heightState },
      ],
    });
  }

  setSrc(src: string) {
    $setState(this, srcState, src);
    return this;
  }

  setAltText(altText: string) {
    $setState(this, altTextState, altText);
    return this;
  }

  setWidth(width: number | 'inherit') {
    $setState(this, widthState, width);
    return this;
  }

  setHeight(height: number | 'inherit') {
    $setState(this, heightState, height);
    return this;
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
          src={$getState(image, srcState)}
          width={$getState(image, widthState)}
          height={$getState(image, heightState)}
          altText={$getState(image, altTextState)}
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
      src: $getState(this, srcState),
      altText: $getState(this, altTextState),
      width: $getState(this, widthState),
      height: $getState(this, heightState),
    };
  }
}

export function $createImageNode(
  src: string,
  altText: string = '',
  width: number | 'inherit' = 'inherit',
  height: number | 'inherit' = 'inherit',
  nodeKey?: NodeKey,
): ImageNode {
  return new ImageNode(nodeKey).setSrc(src).setAltText(altText).setWidth(width).setHeight(height);
}

export function $isImageNode(node: unknown): node is ImageNode {
  return node instanceof ImageNode;
}
