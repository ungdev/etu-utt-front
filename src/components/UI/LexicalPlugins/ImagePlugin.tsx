import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapNodeInElement, mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $createRangeSelection,
  $getSelection,
  $insertNodes,
  $isNodeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DRAGOVER_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
  LexicalEditor,
  TextNode,
} from 'lexical';
import { useEffect } from 'react';
import { $createImageNode, $isImageNode, ImageNode } from './ImageNode';

export const INSERT_IMAGE_COMMAND = createCommand<{
  key: string;
  src: string;
  altText: string;
  width: number;
  height: number;
}>('INSERT_IMAGE_COMMAND');

function textNodeTransform(node: TextNode): void {
  if (!node.isSimpleText() || node.hasFormat('code')) return;

  const text = node.getTextContent();
  const match = text.match(/(?:https:\/\/|www\.)\S+?\.(?:jpe?g|png|webp)(?:\?\S+)?/);
  if (!match || typeof match.index !== 'number') return;
  const start = match.index;
  const end = start + match[0].length;

  let targetNode;
  if (start === 0) [targetNode] = node.splitText(end);
  else [, targetNode] = node.splitText(start, end);
  const imageNode = $createImageNode(match[0]);
  targetNode.replace(imageNode);
}

export function ImagePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) throw new Error('ImagePlugin: ImageNode not registered on editor');

    return mergeRegister(
      editor.registerCommand(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const imageNode = $createImageNode(payload.src, payload.altText, payload.width, payload.height, payload.key);
          $insertNodes([imageNode]);
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow()))
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(DRAGSTART_COMMAND, (event) => onDragStart(event), COMMAND_PRIORITY_HIGH),
      editor.registerCommand(DRAGOVER_COMMAND, (event) => onDragover(event), COMMAND_PRIORITY_LOW),
      editor.registerCommand(DROP_COMMAND, (event) => onDrop(event, editor), COMMAND_PRIORITY_HIGH),
      editor.registerNodeTransform(TextNode, textNodeTransform),
    );
  }, [editor]);

  return null;
}

const TRANSPARENT_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

function onDragStart(event: DragEvent) {
  const node = getImageNodeInSelection();
  if (!node) return false;
  const dataTransfer = event.dataTransfer;
  if (!dataTransfer) return false;
  const img = document.createElement('img');
  img.src = TRANSPARENT_IMAGE;
  dataTransfer.setData('text/plain', '_');
  dataTransfer.setDragImage(img, 0, 0);
  dataTransfer.setData(
    'application/x-lexical-drag',
    JSON.stringify({
      data: {
        altText: node.__altText,
        height: node.__height,
        width: node.__width,
        src: node.__src,
        key: node.getKey(),
      },
      type: ImageNode.getType(),
    }),
  );
  return true;
}

function onDragover(event: DragEvent) {
  const node = getImageNodeInSelection();
  if (!node) return false;
  if (!canDropImage(event)) event.preventDefault();
  return true;
}

function onDrop(event: DragEvent, editor: LexicalEditor) {
  const node = getImageNodeInSelection();
  if (!node) return false;
  const data = getDragImageData(event);
  if (!data) return false;
  event.preventDefault();
  if (canDropImage(event)) {
    const range = getDragSelection(event);
    node.remove();
    const rangeSelection = $createRangeSelection();
    if (range !== null && range !== undefined) rangeSelection.applyDOMRange(range);
    $setSelection(rangeSelection);
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, data);
  }
  return true;
}

function getImageNodeInSelection() {
  const selection = $getSelection();
  if (!$isNodeSelection(selection)) return null;
  const nodes = selection.getNodes();
  const node = nodes[0];
  return $isImageNode(node) ? node : null;
}

function getDragImageData(event: DragEvent) {
  const dragData = event.dataTransfer?.getData('application/x-lexical-drag');
  if (!dragData) return null;
  const { type, data } = JSON.parse(dragData);
  if (type !== ImageNode.getType()) return null;
  return data;
}

function canDropImage(event: DragEvent) {
  const target = event.target;
  return !!(
    target &&
    target instanceof HTMLElement &&
    !target.closest('code, span.editor-image') &&
    target.parentElement &&
    target.parentElement.closest('div.editor-root')
  );
}

declare global {
  interface DragEvent {
    rangeOffset?: number;
    rangeParent?: Node;
  }
}

function getDragSelection(event: DragEvent): Range | null | undefined {
  let range;
  const target = event.target as HTMLElement;
  const targetWindow =
    target?.nodeType === 9 ? (target as unknown as Document).defaultView : target?.ownerDocument?.defaultView;
  const domSelection = (targetWindow || window).getSelection();
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY);
  } else if (event.rangeParent && domSelection !== null) {
    domSelection.collapse(event.rangeParent, event.rangeOffset || 0);
    range = domSelection.getRangeAt(0);
  } else {
    throw Error(`Cannot get the selection when dragging`);
  }

  return range;
}
